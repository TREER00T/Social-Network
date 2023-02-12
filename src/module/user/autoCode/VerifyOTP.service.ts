import {Injectable} from '@nestjs/common';
import {VerifyOTPDto} from "./VerifyOTP.dto";
import Generate from "../../../util/Generate";
import Device from "../../base/Device";
import Token from "../../../util/Token";
import Find from "../../../model/find/user";
import {TTokenWithApiKeyAndUserId, TToken} from "../../../util/Types";

let Update = require("../../../model/update/user")

@Injectable()
export class VerifyOTPService {
    async validationOTPCode(dto: VerifyOTPDto): Promise<boolean> {
        return await Find.isValidAuthCode(dto.phone, dto.code);
    }

    async havePassword(userPhone: string): Promise<boolean> {
        return await Find.password(userPhone);
    }

    async generateToken(dto: VerifyOTPDto): Promise<TToken> {

        let userPhone = dto.phone;

        let userId = await Find.userId(userPhone);

        return {
            ...await Token.setup(userPhone, userId)
        }

    }

    async generateTokenAndAddDeviceInfo(dto: VerifyOTPDto, deviceIp: string, deviceName: string): Promise<TTokenWithApiKeyAndUserId> {

        let userPhone = dto.phone;

        let user = await Find.getApiKeyAndUserId(userPhone);

        if (!user?.apiKey) {
            user.apiKey = Generate.getRandomHash(50);
            await Update.apikey(userPhone, user.apiKey);
        }

        await Device.insert(user._id, {
            ip: deviceIp,
            name: deviceName,
            location: dto.deviceLocation
        });

        return {
            ...await Token.setup(userPhone, user._id),
            apiKey: user.apiKey,
            userId: user._id
        }

    }

    async haveFirstName(userPhone: string) {
        return await Find.haveFirstName(userPhone);
    }

    async updateApiKey(userPhone: string): Promise<boolean | string> {

        let haveApiKey = await Find.getApiKey(userPhone);

        if (haveApiKey)
            return false;

        return await Update.apikey(userPhone, Generate.getRandomHash(50));

    }

    async logoutUser(phone: string) {
        await Update.logoutUser(phone, false);
    }

}
