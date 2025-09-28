import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { donation_controller } from "./donation.controller";
import { donation_validation } from './donation.validation';

const donationRouter = Router();

donationRouter.post("/", RequestValidator(donation_validation.create), donation_controller.create_new_donatio)
donationRouter.get("/", donation_controller.get_all_donations)


export default donationRouter;