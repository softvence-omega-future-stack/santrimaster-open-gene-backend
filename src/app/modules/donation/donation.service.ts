import { Request } from "express";
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


const get_all_donations_from_db = async (req: Request) => {
    // Extract pagination params from query string
    const page = parseInt((req.query.page as string) || "1", 10);   // default: 1
    const limit = parseInt((req.query.limit as string) || "10", 10); // default: 10
    const skip = (page - 1) * limit;

    // Fetch paginated donations
    const donations = await DonationModel.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // Count total documents for pagination info
    const total = await DonationModel.countDocuments();

    const [totalDonationResult, averageDonationResult, donationCount] = await Promise.all([
        DonationModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalDonation: { $sum: "$amount" },
                },
            },
        ]),
        DonationModel.aggregate([
            {
                $group: {
                    _id: null,
                    averageDonation: { $avg: "$amount" },
                },
            },
        ]),
        DonationModel.countDocuments(),
    ]);

    const totalDonation = totalDonationResult[0]?.totalDonation || 0;
    const averageDonation = (averageDonationResult[0]?.averageDonation || 0)?.toFixed(2);

    const overview = {
        totalDonation,
        averageDonation,
        donationCount,
    };



    return {
        data: { donations, overview },
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};


export const donation_services = {
    create_new_donation_into_db,
    get_all_donations_from_db
}