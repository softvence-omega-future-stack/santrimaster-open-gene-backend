import { model, Schema } from "mongoose";
import { TSponsor } from "./sponsor.interface";

const sponsorSchema = new Schema<TSponsor>(
    {
        companyName: { type: String, required: true, trim: true },
        contactName: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        sponsorshipLevel: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true }
    },
    { timestamps: true }
);

export const SponsorModel = model<TSponsor>("sponsor", sponsorSchema); 