import { Request } from "express";
import { AppError } from "../../utils/app_error";
import { isAccountExist } from "../../utils/isAccountExist";
import uploadToAWS from "../../utils/s3";
import { AccountModel } from "../auth/auth.schema";
import { DonationModel } from "../donation/donation.schema";
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
    const skip = ((page || 1) - 1) * (limit || 10);

    // Build dynamic query
    const query: any = {};
    query.status = "PUBLISHED";
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

    const [protocols, total] = await Promise.all([
        ProtocolModel.find(query)
            .sort("-createdAt")
            .skip(skip)
            .limit(limit)
            .exec(),
        ProtocolModel.countDocuments(query),
    ]);


    return {
        data: protocols,
        pagination: {
            total,
            page: page || 1,
            limit: limit || 10,
            totalPages: Math.ceil(total / (limit || 10)),
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
    const payload: TProtocol = { ...req?.body }
    if (req?.file) {
        const uploadedLink = await uploadToAWS(req?.file);
        payload.attachment = uploadedLink
    }
    const result = await ProtocolModel.findOneAndUpdate({ _id: req?.params?.id }, payload, { new: true })
    return result
}
const delete_protocol_into_db = async (req: Request) => {
    const email = req?.user?.email;
    const isAdminExist = await isAccountExist(email as string)
    await ProtocolModel.findOneAndDelete({ authors: isAdminExist._id, _id: req?.params?.id })
    return null
}

const get_my_all_protocol_from_db = async (req: Request) => {
    const email = req?.user?.email;
    const isAdminExist = await isAccountExist(email as string)
    const result = await ProtocolModel.find({ authors: isAdminExist._id }).lean();
    if (!result) {
        throw new AppError("Protocol not found", 404);
    }
    const draftProtocol = result.filter((protocol) => protocol.status == "DRAFT");
    const publishedProtocol = result.filter((protocol) => protocol.status == "PUBLISHED");
    const rejectedProtocol = result.filter((protocol) => protocol.status == "REJECTED");
    const pendingProtocol = result.filter((protocol) => protocol.status == "PENDING");

    const protocols = {
        draft: draftProtocol,
        published: publishedProtocol,
        rejected: rejectedProtocol,
        pending: pendingProtocol
    }
    const overview = {
        total: result.length,
        published: publishedProtocol.length,
        rejected: rejectedProtocol.length,
        pending: pendingProtocol.length,
        draft: draftProtocol.length
    }

    return {
        protocols,
        overview
    }
}


const get_admin_overview_data_from_db = async () => {

    const [protocols, users, totalDonation, donar] = await Promise.all([
        ProtocolModel.find().sort("-createdAt").lean(),
        AccountModel.find({ role: { $ne: "ADMIN" } }).lean(),
        DonationModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalDonation: { $sum: "$amount" },
                },
            },
        ]),
        DonationModel.find().lean()
    ])

    const overview = {
        pendingProtocol: protocols?.filter((protocol) => protocol?.status == "PENDING")?.length,
        draftProtocol: protocols?.filter((protocol) => protocol?.status == "DRAFT")?.length,
        totalUser: users?.length,
        totalDonation: totalDonation[0]?.totalDonation
    }
    const pendingProtocol = protocols?.filter((protocol) => protocol?.status == "PENDING");
    const activity = protocols?.slice(0, 5)?.map((protocol: any) => ({ name: protocol?.protocolTitle, time: protocol?.updatedAt }))
    const chart = {
        totalSubmission: protocols?.length || 0,
        approvedRate: protocols?.length
            ? (protocols.filter((p) => p?.status === "PUBLISHED").length / protocols.length) * 100
            : 0,
        todaySubmission: protocols?.filter((p: any) => {
            const created = new Date(p?.createdAt);
            const today = new Date();
            return created.toDateString() === today.toDateString();
        }).length || 0
    };


    const donation = {
        totalDonar: donar?.length || 0,
        avgDonation: donar?.length
            ? (totalDonation[0]?.totalDonation / donar.length).toFixed(2)
            : "0.00",
        recentDonar: donar?.slice(0, 5)
    };


    return {
        overview,
        pendingProtocol,
        recentActivity: {
            activity,
            chart
        },
        donation,
        users: users?.slice(0, 5)
    };
}

export const protocol_services = {
    save_new_protocol_into_db,
    get_all_protocol_from_db,
    get_protocol_by_id,
    update_protocol_into_db,
    delete_protocol_into_db,
    get_my_all_protocol_from_db,
    get_admin_overview_data_from_db
}