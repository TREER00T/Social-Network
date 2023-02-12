import {Injectable} from '@nestjs/common';
import Generate from "../../../util/Generate";
import {TwoStepDto} from "./TwoStep.dto";
import Device from "../../base/Device";
import Find from "../../../model/find/user";

let Update = require("../../../model/update/user");

@Injectable()
export class TwoStepService {
    async isValidPassword(userPhone: string, password: string): Promise<boolean> {
        return await Find.isValidPassword(userPhone, Generate.getHashData(password.trim(), userPhone));
    }

    async getUserApiKeyWithUserId(userPhone: string, dto: TwoStepDto, deviceIp: string, deviceName: string) {

        let user = await Find.getApiKeyAndUserId(userPhone);

        await Device.insert(user._id, {
            ip: deviceIp,
            name: deviceName,
            location: dto.deviceLocation
        })

        return {
            apiKey: user.apiKey,
            userId: user._id
        }

    }

    async haveFirstName(userPhone: string) {
        return await Find.haveFirstName(userPhone);
    }

    async logoutUser(phone: string) {
        await Update.logoutUser(phone, false);
    }

}
