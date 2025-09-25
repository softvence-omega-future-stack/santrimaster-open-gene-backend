import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { auth_controllers } from "./auth.controller";
import { auth_validation } from "./auth.validation";

const authRoute = Router()

authRoute.post("/register", RequestValidator(auth_validation.register_validation), auth_controllers.register_user)
authRoute.post("/login", RequestValidator(auth_validation.login_validation), auth_controllers.login_user)

authRoute.get(
    '/me',
    auth("ADMIN", "CLINICIAN", "DONAR", "ENGINEER", "REVIEWER", "RESEARCHER", "GUEST"),
    auth_controllers.get_my_profile,
);

authRoute.post('/refresh-token', auth_controllers.refresh_token);
authRoute.post(
    '/change-password',
    auth("ADMIN", "CLINICIAN", "DONAR", "ENGINEER", "REVIEWER", "RESEARCHER", "GUEST"),
    RequestValidator(auth_validation.changePassword),
    auth_controllers.change_password,
);
authRoute.post(
    '/forgot-password',
    RequestValidator(auth_validation.forgotPassword),
    auth_controllers.forget_password,
);
authRoute.post(
    '/reset-password',
    RequestValidator(auth_validation.resetPassword),
    auth_controllers.reset_password,
);

export default authRoute;
