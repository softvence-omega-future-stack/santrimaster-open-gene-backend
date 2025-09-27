import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { sponsor_controller } from "./sponsor.controller";
import { sponsor_validation } from "./sponsor.validation";

const sponsorRouter = Router();

sponsorRouter.post("/", RequestValidator(sponsor_validation.create), sponsor_controller.save_new_sponsor)
sponsorRouter.get("/", sponsor_controller.get_all_sponsor)
sponsorRouter.delete("/:id", auth("ADMIN"), sponsor_controller.delete_sponsor)


export default sponsorRouter;