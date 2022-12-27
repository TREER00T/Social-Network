import Generate from "./Generate";

export default {

    async setup(userPhone: string, userId: string): Promise<{ accessToken: string, refreshToken: string }> {
        return {
            accessToken: await Generate.getJwtEncrypt(Generate.getJwtSign({
                phoneNumber: userPhone,
                id: userId,
                expiresIn: '12h',
                type: 'at'
            }, userPhone)),
            refreshToken: await Generate.getJwtEncrypt(Generate.getJwtSign({
                phoneNumber: userPhone,
                id: userId,
                expiresIn: '1d',
                type: 'rt'
            }, userPhone))
        }
    }

}