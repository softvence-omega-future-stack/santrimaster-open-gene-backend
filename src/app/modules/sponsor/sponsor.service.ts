import { TSponsor } from "./sponsor.interface";
import { SponsorModel } from "./sponsor.schema";

const save_new_sponsor_into_db = async (payload: TSponsor) => {
    const result = await SponsorModel.create(payload)
    return result
}
const get_all_sponsor_from_db = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [sponsors, total] = await Promise.all([
        SponsorModel.find()
            .sort("-createdAt")
            .skip(skip)
            .limit(limit)
            .exec(),
        SponsorModel.countDocuments()
    ]);

    return {
        data: sponsors,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const delete_sponsor_from_db = async (id: string) => {
    await SponsorModel.findByIdAndDelete(id)
    return null
}

export const sponsor_services = {
    save_new_sponsor_into_db,
    get_all_sponsor_from_db,
    delete_sponsor_from_db
}