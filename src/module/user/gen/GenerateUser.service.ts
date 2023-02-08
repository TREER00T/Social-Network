import {Injectable} from "@nestjs/common";
import {GenerateUserDto} from "./GenerateUser.dto";
import Generate from "../../../util/Generate";
import Util from "../../../util/Util";
import Find from "../../../model/find/user";
import Insert from "../../../model/add/user";

let Update = require("../../../model/update/user");

@Injectable()
export class GenerateUserService {
    async generateUser(dto: GenerateUserDto): Promise<boolean> {

        let userPhone = dto.phone,
            isPhoneNumberInDb = await Find.userPhone(userPhone);

        if (!isPhoneNumberInDb) {
            await Insert.phoneAndAuthCode(userPhone, Generate.getVerificationCode(), Util.getRandomHexColor());

            return true;
        }

        await Update.authCode(userPhone, Generate.getVerificationCode());

        return false;

    }
}
