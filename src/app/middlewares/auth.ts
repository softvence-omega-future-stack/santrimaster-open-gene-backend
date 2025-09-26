import { NextFunction, Request, Response } from 'express';
import { configs } from '../configs';
import { AccountModel } from '../modules/auth/auth.schema';
import { AppError } from '../utils/app_error';
import { jwtHelpers, JwtPayloadType } from '../utils/JWT';


type Role = "GUEST" | "RESEARCHER" | "CLINICIAN" | "ENGINEER" | "REVIEWER" | "DONAR" | "ADMIN"


const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization || req.cookies['accessToken'];
            if (!token) {
                throw new AppError('You are not authorize!!', 401);
            }
            const verifiedUser = jwtHelpers.verifyToken(
                token,
                configs.jwt.access_token as string,
            );
            if (!roles.length || !roles.includes(verifiedUser.role)) {
                throw new AppError('You are not authorize!!', 401);
            }
            // check user
            const isUserExist = await AccountModel.findOne({ email: verifiedUser?.email }).lean()
            if (!isUserExist) {
                throw new AppError("Account not found !", 404)
            }
            if (isUserExist?.accountStatus == "INACTIVE") {
                throw new AppError("This Account is temporary blocked !", 401)
            }
            if (isUserExist?.accountStatus == "SUSPENDED") {
                throw new AppError("This Account is permanently blocked !", 401)
            }
            if (isUserExist?.isDeleted) {
                throw new AppError("This account is deleted", 401)
            }
            req.user = verifiedUser as JwtPayloadType;
            next();
        } catch (err) {
            next(err);
        }
    };
};

export default auth;