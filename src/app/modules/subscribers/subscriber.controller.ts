import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { subscriber_services } from "./subscriber.service";

const save_new_subscriber = catchAsync(async (req, res) => {
    const result = await subscriber_services.save_new_subscriber_into_db(req?.body)
    manageResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Subscriber saved successfully!',
        data: result,
    })
})

export const subscriber_controller = {
    save_new_subscriber
}