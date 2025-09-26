import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import uploader from "../../middlewares/uploader";
import { message_controller } from "./message.controller";
import { message_validation } from "./message.validation";
import auth from "../../middlewares/auth";

const messageRouter = Router();

messageRouter.post(
    "/",
    uploader.single("image"),
    (req, res, next) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data)
        }
        next();
    },
    RequestValidator(message_validation.create),
    message_controller.save_new_message
)

messageRouter.get("/",auth("ADMIN"), message_controller.get_all_message)



export default messageRouter;