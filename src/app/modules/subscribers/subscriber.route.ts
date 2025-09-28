import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { subscriber_controller } from "./subscriber.controller";
import { subscriber_validation } from "./subscriber.validation";

const subscriberRouter = Router();

subscriberRouter.post("/", RequestValidator(subscriber_validation), subscriber_controller.save_new_subscriber)

export default subscriberRouter;