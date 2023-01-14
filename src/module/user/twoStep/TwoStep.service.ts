import {Injectable} from '@nestjs/common';
import Generate from "../../../util/Generate";
import {TwoStepDto} from "./TwoStep.dto";
import Device from "../../base/Device";
import Find from "../../../model/find/user";

@Injectable()
export class TwoStepService {
    async isValidPassword(userPhone: string, password: string): Promise<boolean> {
        return await Find.isValidPassword(userPhone, Generate.getHashData(password.trim(), userPhone));
    }

    async getUserApiKey(userPhone: string, dto: TwoStepDto, deviceIp: string, deviceName: string): Promise<object> {

        let user = await Find.getApiKeyAndUserId(userPhone);

        await Device.insert(user._id, {
            ip: deviceIp,
            name: deviceName,
            location: dto.deviceLocation
        })

        return {
            apiKey: user.apiKey
        }

    }
}
