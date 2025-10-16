import mongoose, { Schema } from "mongoose";
import { TAccount } from "./auth.interface";


const AccountSchema = new Schema<TAccount>({
    fullName: { type: String, required: true },
    affiliation: { type: String, required: true },
    orcid: { type: String, required: false },
    bio: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    lastLoginTime: { type: Date },
    lastPasswordChange: { type: Date },
    isDeleted: { type: Boolean, default: false },
    accountStatus: {
        type: String,
        enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
        default: "ACTIVE",
    },
    isTermAgree: { type: Boolean, default: false },
    role: {
        type: String,
        enum: [
            "GUEST",
            "RESEARCHER",
            "CLINICIAN",
            "ENGINEER",
            "REVIEWER",
            "DONAR",
            "ADMIN",
        ],
        default: "GUEST",
    },
    additionalInfo: {
        motivation: { type: String },
        experience: { type: String },
        resume: { type: String },
        googleScholar: { type: String },
        portfolio: { type: String },
        availability: { type: String },
        isAgree: { type: Boolean, default: false },
    },
}, { timestamps: true ,versionKey: false});

export const AccountModel = mongoose.model<TAccount>("account", AccountSchema);
