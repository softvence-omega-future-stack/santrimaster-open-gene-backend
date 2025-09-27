import Stripe from "stripe";
import { configs } from "../../configs";
import { AppError } from "../../utils/app_error";
import { TDonation } from "./donation.interface";
import { DonationModel } from "./donation.schema";


export const stripe = new Stripe(configs.stripe.secretKey as string);

const createStripeCheckoutSession = async (
    paymentData: Partial<TDonation>,
    donationId: string
) => {
    if (!paymentData?.amount || !paymentData?.donarEmail) {
        throw new AppError("Missing required payment data: amount or email", 403);
    }

    // 1. Find or create customer
    const existingCustomer = await stripe.customers.list({
        email: paymentData.donarEmail,
        limit: 1,
    });

    const customer =
        existingCustomer?.data[0] ||
        (await stripe.customers.create({ email: paymentData.donarEmail }));

    // 2. Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer: customer?.id,
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round(paymentData.amount * 100), // convert to cents
                    product_data: { name: "Donation Payment" },
                },
                quantity: 1,
            },
        ],
        metadata: {
            donationId, // ✅ correct naming
            customerId: customer?.id, // ✅ Stripe customer
            email: paymentData?.donarEmail,
            amount: paymentData?.amount?.toString(),
        },
        success_url: `${configs.jwt.front_end_url as string}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${configs.jwt.front_end_url as string}/failed`,
    });

    return session;
};


const create_new_donation_into_db = async (payload: TDonation) => {
    const result = await DonationModel.create(payload);
    // If result is an array, take the first element
    const donationDoc = Array.isArray(result) ? result[0] : result;
    const stripeCheckout = await createStripeCheckoutSession(
        payload,
        donationDoc._id.toString()
    );

    return { stripeCheckout, donation: donationDoc };
};


export const donation_services = {
    create_new_donation_into_db
}