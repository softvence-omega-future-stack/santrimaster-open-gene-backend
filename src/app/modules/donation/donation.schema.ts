import { model, Schema } from "mongoose";
import { TDonation } from "./donation.interface";

const donationSchema = new Schema<TDonation>(
    {
        donationType: {
            type: String,
            enum: ['ONE_TIME', 'MONTHLY', 'ANNUAL'],
            required: true
        },
        amount: { type: Number, required: true, min: 0 },
        donarName: { type: String, required: true, trim: true },
        donarEmail: { type: String, required: true, trim: true, lowercase: true },
        country: { type: String, required: true, trim: true },
        tribute: { type: String, required: true, trim: true },
        paymentStatus: {
            type: String,
            enum: ['PENDING', 'SUCCESS', 'FAILED'],
            default: 'PENDING'
        }
    },
    { timestamps: true }
);

export const DonationModel = model<TDonation>("donation", donationSchema);