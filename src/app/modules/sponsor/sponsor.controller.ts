import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { sponsor_services } from "./sponsor.service";

const save_new_sponsor = catchAsync(async (req, res) => {
    const result = await sponsor_services.save_new_sponsor_into_db(req?.body)
    manageResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Sponsor saved successfully!',
        data: result,
    })
})
const get_all_sponsor = catchAsync(async (req, res) => {
    const { page, limit } = req?.query;
    const result = await sponsor_services.get_all_sponsor_from_db(Number(page), Number(limit))
    manageResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Sponsor fetched successfully!',
        data: result?.data,
        meta: result?.pagination
    })
})
const delete_sponsor = catchAsync(async (req, res) => {
    const result = await sponsor_services.delete_sponsor_from_db(req?.params?.id)
    manageResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Sponsor delete successfully!',
        data: null
    })
})


export const sponsor_controller = {
    save_new_sponsor,
    get_all_sponsor,
    delete_sponsor
}