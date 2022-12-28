import {Injectable} from '@nestjs/common';
import {VerifyAuthCodeDto} from "./VerifyAuthCode.dto";
import Generate from "../../../util/Generate";
import Device from "../../base/Device";
import Token from "../../../util/Token";

let Find = require("../../../model/find/user"),
    Update = require("../../../model/update/user");

@Injectable()
export class VerifyAuthCodeService {
    async validationAuthCode(dto: VerifyAuthCodeDto): Promise<boolean> {
        return await Find.isValidAuthCode(dto.phone, dto.authCode);
    }

    async havePassword(userPhone: string): Promise<boolean> {
        return await Find.password(userPhone);
    }

    async generateToken(dto: VerifyAuthCodeDto): Promise<object> {

        let userPhone = dto.phone;

        let user = await Find.getApiKeyAndUserId(userPhone);

        await Device.insert(user._id, {
            ip: dto.deviceIp,
            name: dto.deviceName,
            location: dto.deviceLocation
        });

        return {
            ...await Token.setup(userPhone, user._id),
            apiKey: user.apiKey
        }

    }

    async updateApiKey(userPhone): Promise<boolean | string> {

        let haveApiKey = await Find.getApiKey(userPhone);

        if (!haveApiKey)
            return false;

        return await Update.apikey(userPhone, Generate.getRandomHash(50));

    }

}
