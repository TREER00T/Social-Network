import {Injectable} from '@nestjs/common';
import Generate from "../../../util/Generate";

let Update = require("../../../model/update/user"),
    Find = require("../../../model/find/user");


@Injectable()
export class PersonalAuthService {
    async twoAuth(usrPhone: string, email: string = '', password: string = '') {
        return await Update.passwordAndEmail(usrPhone, Generate.getHashData(password, usrPhone), email);
    }

    async updatePassword(userPhone: string, newPasswordHash: string) {
        await Update.password(userPhone, newPasswordHash);
    }

    async isValidPassword(userPhone: string, oldPasswordHash: string) {
        return await Find.isValidPassword(userPhone, oldPasswordHash)
    }
}
