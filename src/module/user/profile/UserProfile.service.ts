import {Injectable} from '@nestjs/common';
import {UserDto} from "./User.dto";
import Find from "../../../model/find/user";

let Update = require("../../../model/update/user")

@Injectable()
export class UserProfileService {

    async updateFirstAndLastName(userPhone: string, dto: UserDto) {
        await Update.name(userPhone, dto.firstName, dto?.lastName ? dto.lastName : '');
    }

    async getApiKey(userPhone: string) {
        return await Find.getApiKey(userPhone);
    }

}
