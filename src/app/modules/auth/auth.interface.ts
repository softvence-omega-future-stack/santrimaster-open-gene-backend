export type TAccount = {
    fullName: string;
    affiliation: string;
    orcid: string;
    bio?: string;
    email: string;
    password: string;
    profileImage?: string;
    lastLoginTime?: Date;
    lastPasswordChange?: Date;
    isDeleted?: boolean;
    accountStatus?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    isTermAgree?: boolean,
    role: "GUEST" | "RESEARCHER" | "CLINICIAN" | "ENGINEER" | "REVIEWER" | "DONAR" | "ADMIN";

    // coming from if admin confirmed
    additionalInfo?: {
        motivation?: string;
        experience?: string;
        resume?: string;
        googleScholar?: string;
        portfolio?: string;
        availability?: string;
        isAgree?: boolean
    }
}



export type TRegisterPayload = {
    fullName: string;
    affiliation: string;
    orcid: string;
    email: string;
    password: string;
    isTermAgree?: boolean,

}
export type TLoginPayload = {
    email: string;
    password: string

}

export type TJwtUser = {
    email: string,
    role?: "USER" | "ADMIN",
}