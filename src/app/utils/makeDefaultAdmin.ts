import bcrypt from 'bcrypt';
import { configs } from "../configs";
import { AccountModel } from '../modules/auth/auth.schema';

export const makeDefaultAdmin = async () => {
    const isAdminExist = await AccountModel.exists({ role: "ADMIN", isDeleted: false });
    if (isAdminExist) return;
    await AccountModel.create(
        {
            email: configs.admin.email,
            password: bcrypt.hashSync(configs.admin.password as string, 10),
            role: "ADMIN",
            affiliation: "admin_profile",
            orcid: "00000000",
            fullName: "Admin",
        },
    );
};
