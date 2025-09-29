import bcrypt from "bcrypt";
import { Request } from "express";
import httpStatus from 'http-status';
import { JwtPayload, Secret } from "jsonwebtoken";
import { configs } from "../../configs";
import { AppError } from "../../utils/app_error";
import { isAccountExist } from "../../utils/isAccountExist";
import { jwtHelpers } from "../../utils/JWT";
import sendMail from "../../utils/mail_sender";
import uploadToAWS from "../../utils/s3";
import { TLoginPayload, TRegisterPayload } from "./auth.interface";
import { AccountModel } from "./auth.schema";
// register user
const register_user_into_db = async (payload: TRegisterPayload) => {
    // Check if the account already exists
    const isExistAccount = await AccountModel.findOne({ email: payload?.email }).lean();
    if (isExistAccount) {
        throw new AppError("Account already exist!!", httpStatus.BAD_REQUEST);
    }
    // Hash the password
    const hashPassword = bcrypt.hashSync(payload.password, 10);
    payload.password = hashPassword;
    const newAccount = await AccountModel.create(payload);
    return newAccount;
};

const update_profile_into_db = async (req: Request) => {
    const email = req?.user?.email;
    const file = req?.file;
    const isAccount = await isAccountExist(email as string)
    const payload = { ...req?.body }

    if (file) {
        const uploadedLink = await uploadToAWS(file);
        console.log(uploadedLink)
        payload.profileImage = uploadedLink
    }
    const result = await AccountModel.findByIdAndUpdate({ _id: isAccount._id }, payload, { new: true });
    return result
}


// login user
const login_user_from_db = async (payload: TLoginPayload) => {
    // check account info 
    const isExistAccount = await isAccountExist(payload?.email)

    const isPasswordMatch = await bcrypt.compare(
        payload.password,
        isExistAccount.password,
    );
    if (!isPasswordMatch) {
        throw new AppError('Invalid password', httpStatus.UNAUTHORIZED);
    }
    const accessToken = jwtHelpers.generateToken(
        {
            email: isExistAccount.email,
            role: isExistAccount.role,
        },
        configs.jwt.access_token as Secret,
        configs.jwt.access_expires as string,
    );

    const refreshToken = jwtHelpers.generateToken(
        {
            email: isExistAccount.email,
            role: isExistAccount.role,
        },
        configs.jwt.refresh_token as Secret,
        configs.jwt.refresh_expires as string,
    );
    const currentTime = new Date().toISOString();
    await AccountModel.findByIdAndUpdate({ _id: isExistAccount._id }, { lastLoginTime: currentTime }, { new: true })
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        role: isExistAccount.role
    };

}

const get_my_profile_from_db = async (email: string) => {
    const isExistAccount = await isAccountExist(email)
    isExistAccount.password = ""
    return isExistAccount;
};

const refresh_token_from_db = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(
            token,
            configs.jwt.refresh_token as Secret,
        );
    } catch (err) {
        throw new Error('You are not authorized!');
    }
    const userData = await AccountModel.findOne({ email: decodedData.email, status: "ACTIVE", isDeleted: false })
    const accessToken = jwtHelpers.generateToken(
        {
            email: userData!.email,
            role: userData!.role,
        },
        configs.jwt.access_token as Secret,
        configs.jwt.access_expires as string,
    );
    return accessToken;
};

const change_password_from_db = async (
    user: JwtPayload,
    payload: {
        oldPassword: string;
        newPassword: string;
    },
) => {
    const isExistAccount = await isAccountExist(user?.email)

    const isCorrectPassword: boolean = await bcrypt.compare(
        payload.oldPassword,
        isExistAccount.password,
    );

    if (!isCorrectPassword) {
        throw new AppError('Old password is incorrect', httpStatus.UNAUTHORIZED);
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 10);
    await AccountModel.findOneAndUpdate({ email: isExistAccount.email }, {
        password: hashedPassword,
        lastPasswordChange: Date()
    })
    return 'Password changed successful.';
};

const forget_password_from_db = async (email: string) => {
    const isAccountExists = await isAccountExist(email)
    const resetToken = jwtHelpers.generateToken(
        {
            email: isAccountExists.email,
            role: isAccountExists.role,
        },
        configs.jwt.reset_secret as Secret,
        configs.jwt.reset_expires as string,
    );

    const resetPasswordLink = `${configs.jwt.front_end_url}/reset?token=${resetToken}&email=${isAccountExists.email}`;
    const emailTemplate = `<p>Click the link below to reset your password:</p><a href="${resetPasswordLink}">Reset Password</a>`;

    await sendMail({
        to: email,
        subject: "Password reset successful!",
        textBody: "Your password is successfully reset.",
        htmlBody: emailTemplate
    });

    return 'Check your email for reset link';
};

const reset_password_into_db = async (
    token: string,
    email: string,
    newPassword: string,
) => {
    let decodedData: JwtPayload;
    try {
        decodedData = jwtHelpers.verifyToken(
            token,
            configs.jwt.reset_secret as Secret,
        );
    } catch (err) {
        throw new AppError(
            'Your reset link is expire. Submit new link request!!',
            httpStatus.UNAUTHORIZED,
        );
    }

    const isAccountExists = await isAccountExist(email)

    const hashedPassword: string = await bcrypt.hash(newPassword, 10);

    await AccountModel.findOneAndUpdate({ email: isAccountExists.email }, {
        password: hashedPassword,
        lastPasswordChange: Date()
    })
    return 'Password reset successfully!';
};


const delete_user_from_db =async(req : Request)=>{
    
}


export const auth_services = {
    register_user_into_db,
    login_user_from_db,
    get_my_profile_from_db,
    refresh_token_from_db,
    change_password_from_db,
    forget_password_from_db,
    reset_password_into_db,
    update_profile_into_db
}