import { Request } from "express";
import uploadToAWS from "../../utils/s3";
import { TMessage } from "./message.interface";
import { MessageModel } from "./message.schema";

const save_new_message_into_db = async (req: Request) => {
    const data: TMessage = req?.body;
    if (req?.file) {
        const uploadedLink = await uploadToAWS(req?.file);
        data.attachments = uploadedLink
    }
    const result = await MessageModel.create(data);
    return result;
}

const get_all_message_from_db = async (page = 1, limit = 10) => {
    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Fetch messages with pagination
    const result = await MessageModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // optional: newest first

    // Optional: get total count for frontend pagination
    const total = await MessageModel.countDocuments();

    return {
        result,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};


export const message_services = {
    save_new_message_into_db,
    get_all_message_from_db
}