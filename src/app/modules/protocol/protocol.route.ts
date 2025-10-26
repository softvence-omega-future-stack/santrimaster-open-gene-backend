import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import uploader from "../../middlewares/uploader";
import { protocol_controller } from "./protocol.controller";
import { protocol_validation } from "./protocol.validation";

const protocolRouter = Router();

protocolRouter.post(
    "/",
    auth("ADMIN", "CLINICIAN", "DONAR", "ENGINEER", "REVIEWER", "RESEARCHER", "GUEST"),
    uploader.single("image"),
    async (req, res, next) => {
        if (req?.body?.data) {
            req.body = JSON.parse(req?.body?.data)
        }
        next();
    },
    RequestValidator(protocol_validation.create),
    protocol_controller.save_new_protocol
)
protocolRouter.delete("/:id", auth("ADMIN", "CLINICIAN", "DONAR", "ENGINEER", "REVIEWER", "RESEARCHER", "GUEST"), protocol_controller.delete_protocol)
protocolRouter.patch(
    "/:id",
    auth("ADMIN", "CLINICIAN", "DONAR", "ENGINEER", "REVIEWER", "RESEARCHER", "GUEST"),
    uploader.single("image"),
    (req, res, next) => {
        if (req?.body?.data) {
            req.body = JSON.parse(req?.body?.data)
        }
        next();
    },
    RequestValidator(protocol_validation.update),
    protocol_controller.update_protocol
)

protocolRouter.get("/", protocol_controller.get_all_protocol)
protocolRouter.get("/admin-overview", auth("ADMIN"), protocol_controller.get_admin_overview_data)
protocolRouter.get("/me", auth("ADMIN", "CLINICIAN", "DONAR", "ENGINEER", "REVIEWER", "RESEARCHER", "GUEST"), protocol_controller.get_my_all_protocol)
protocolRouter.get("/:id", protocol_controller.get_protocol)


export default protocolRouter;