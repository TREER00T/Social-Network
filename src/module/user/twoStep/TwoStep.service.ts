import {Injectable} from '@nestjs/common';
import Generate from "../../../util/Generate";
import {TwoStepDto} from "./TwoStep.dto";
import Device from "../../base/Device";

let Find = require("../../../model/find/user");

@Injectable()
export class TwoStepService {
    async isValidPassword(userPhone: string, password: string): Promise<object> {
        return await Find.isValidPassword(userPhone, Generate.getHashData(password.trim(), userPhone));
    }

    async getUserApiKey(userPhone: string, dto: TwoStepDto): Promise<object> {

        let user = await Find.getApiKeyAndUserId(userPhone);

        await Device.insert(user._id, {
            ip: dto.deviceIp,
            name: dto.deviceName,
            location: dto.deviceLocation
        })

        return {
            apiKey: user.apiKey
        }

    }
}
