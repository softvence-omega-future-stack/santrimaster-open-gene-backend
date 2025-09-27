import { Request, Response } from "express";
import Stripe from "stripe";
import { configs } from "../../configs";
import { AppError } from "../../utils/app_error";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { DonationModel } from "./donation.schema";
import { donation_services } from "./donation.service";

export const stripe = new Stripe(configs.stripe.secretKey as string);

export const handleStripeWebhook = async (
    req: Request,
    res: Response
): Promise<void> => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        configs.stripe.stripeWebhookSecret as string
    );
    // ✅ Move usage *after* successful assignment
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session?.metadata?.orderId;

        // ✅ Validate required metadata fields
        if (!orderId) {
            throw new AppError("Missing required metadata fields", 403);
        }
        await DonationModel.findOneAndUpdate(
            { _id: orderId }, // just the ID string
            { paymentStatus: 'SUCCESS' },
            { new: true }
        );

    }
    res.status(200).json({ received: true });
};





const create_new_donatio = catchAsync(async (req, res) => {
    const result = await donation_services.create_new_donation_into_db(req?.body)
    manageResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Donation saved successfully!',
        data: result,
    })
})
const get_all_donations = catchAsync(async (req, res) => {
    const result = await donation_services.get_all_donations_from_db(req)
    manageResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Donation fetched successfully!',
        data: result?.data,
        meta: result?.pagination
    })
})

export const donation_controller = {
    create_new_donatio,
    get_all_donations
}