import { Schema, model } from "mongoose";
import { TMessage } from "./message.interface";



const MessageSchema = new Schema<TMessage>(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        attachments: { type: String, required: false },
        isTermAgreed: { type: Boolean, required: true },
    },
    { timestamps: true }
);

export const MessageModel = model<TMessage>("message", MessageSchema);
