import httpStatus from 'http-status';
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { protocol_services } from "./protocol.service";

const save_new_protocol = catchAsync(async (req, res) => {
    const result = await protocol_services.save_new_protocol_into_db(req)
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Protocol saved successfully!',
        data: result,
    })
})
const update_protocol = catchAsync(async (req, res) => {
    const result = await protocol_services.update_protocol_into_db(req)
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Protocol updated successfully!',
        data: result,
    })
})
const get_all_protocol = catchAsync(async (req, res) => {
    const { page, limit } = req?.query
    const result = await protocol_services.get_all_protocol_from_db(Number(page), Number(limit))
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Protocol fetched successfully!',
        data: result?.data,
        meta: result?.pagination
    })
})
const get_protocol = catchAsync(async (req, res) => {
    const ID = req?.params?.id
    const result = await protocol_services.get_protocol_by_id(ID)
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Protocol fetched successfully!',
        data: result
    })
})
const delete_protocol = catchAsync(async (req, res) => {
    await protocol_services.delete_protocol_into_db(req)
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Protocol deleted successfully!',
        data: null
    })
})


export const protocol_controller = {
    save_new_protocol,
    get_all_protocol,
    get_protocol,
    update_protocol,
    delete_protocol
}