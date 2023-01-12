import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/user";

let Update = require("../../../model/update/user");

@Injectable()
export class PersonalUsernameService {

    async isExistUsername(username: string) {
        return await Find.isExistUsername(username.toString().trim());
    }

    async updateUsername(userPhone: string, username: string) {
        return await Update.username(userPhone, username.toString().trim());
    }

}
