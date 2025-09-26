import httpStatus from 'http-status';
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { message_services } from "./message.service";

const save_new_message = catchAsync(async (req, res) => {
    const result = await message_services.save_new_message_into_db(req)
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Message sent successfully!',
        data: result,
    })
})
const get_all_message = catchAsync(async (req, res) => {
    const result = await message_services.get_all_message_from_db(Number(req?.query?.page), Number(req?.query?.limit))
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Message sent successfully!',
        data: result?.result,
        meta: result?.meta
    })
})

export const message_controller = {
    save_new_message,
    get_all_message
}