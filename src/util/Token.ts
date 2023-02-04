import Generate from "./Generate";
import {TToken} from "./Types";

export default {

    async setup(userPhone: string, userId: string): Promise<TToken> {
        return {
            accessToken: await Generate.getJwtEncrypt(Generate.getJwtSign({
                phoneNumber: userPhone,
                id: userId,
                expiresIn: '30d',
                type: 'at'
            }, userPhone)),
            refreshToken: await Generate.getJwtEncrypt(Generate.getJwtSign({
                phoneNumber: userPhone,
                id: userId,
                expiresIn: '60d',
                type: 'rt'
            }, userPhone))
        }
    }

}