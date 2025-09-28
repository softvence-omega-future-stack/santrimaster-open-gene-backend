import { model, Schema } from "mongoose";

const SubscriberSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    interest: {
        type: String,
        required: true
    }
})

export const SubscriberModel = model("subscriber", SubscriberSchema);