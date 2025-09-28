import { Request } from "express";
import { AppError } from "../../utils/app_error";
import { isAccountExist } from "../../utils/isAccountExist";
import uploadToAWS from "../../utils/s3";
import { TProtocol } from "./protocol.interface";
import { ProtocolModel } from "./protocol.schema";


interface FilterOptions {
    search?: string;           // for protocolTitle
    category?: string;
    tags?: string[];
    technique?: string;
    modality?: string;
    organism?: string;
    phase?: string;
    difficulty?: string;
    bslLevel?: string;
    isConfirmed?: boolean;
    isAcknowledged?: boolean;
    isConfidential?: boolean;
}
const save_new_protocol_into_db = async (req: Request) => {
    const email = req?.user?.email;
    const isAdminExist = await isAccountExist(email as string)
    const payload: TProtocol = { ...req?.body }
    payload.authors = isAdminExist._id
    if (req?.file) {
        const uploadedLink = await uploadToAWS(req?.file);
        payload.attachment = uploadedLink
    }
    const result = await ProtocolModel.create(payload)
    return result
}


const get_all_protocol_from_db = async (
    page: number,
    limit: number,
    filters: FilterOptions
) => {
    const skip = (page - 1) * limit;

    // Build dynamic query
    const query: any = {};

    // Search by protocolTitle
    if (filters.search) {
        query.protocolTitle = { $regex: filters.search, $options: "i" }; // case-insensitive
    }

    // Filterable fields
    if (filters.category) query.category = filters.category;
    if (filters.tags) query.tags = { $in: filters.tags };
    if (filters.technique) query.technique = filters.technique;
    if (filters.modality) query.modality = filters.modality;
    if (filters.organism) query.organism = filters.organism;
    if (filters.phase) query.phase = filters.phase;
    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.bslLevel) query.bslLevel = filters.bslLevel;
    if (typeof filters.isConfirmed === "boolean") query.isConfirmed = filters.isConfirmed;
    if (typeof filters.isAcknowledged === "boolean") query.isAcknowledged = filters.isAcknowledged;
    if (typeof filters.isConfidential === "boolean") query.isConfidential = filters.isConfidential;

    const [protocols, total, allProtocols] = await Promise.all([
        ProtocolModel.find(query)
            .sort("-createdAt")
            .skip(skip)
            .limit(limit)
            .exec(),
        ProtocolModel.countDocuments(query),
        ProtocolModel.find()
    ]);


    return {
        data: protocols,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
const get_protocol_by_id = async (id: string) => {
    const protocol = await ProtocolModel.findById(id)
        .populate([
            { path: "authors", select: "-password" },
            { path: "coAuthors", select: "-password" }
        ])
        .lean()
        .exec();

    if (!protocol) {
        throw new AppError("Protocol not found", 404);
    }
    return protocol;
};

const update_protocol_into_db = async (req: Request) => {
    const email = req?.user?.email;
    const isAdminExist = await isAccountExist(email as string)
    const payload: TProtocol = { ...req?.body }
    if (req?.file) {
        const uploadedLink = await uploadToAWS(req?.file);
        payload.attachment = uploadedLink
    }
    const result = await ProtocolModel.findOneAndUpdate({ authors: isAdminExist._id, _id: req?.params?.id }, payload, { new: true })
    return result
}
const delete_protocol_into_db = async (req: Request) => {
    const email = req?.user?.email;
    const isAdminExist = await isAccountExist(email as string)
    await ProtocolModel.findOneAndDelete({ authors: isAdminExist._id, _id: req?.params?.id })
    return null
}


export const protocol_services = {
    save_new_protocol_into_db,
    get_all_protocol_from_db,
    get_protocol_by_id,
    update_protocol_into_db,
    delete_protocol_into_db
}