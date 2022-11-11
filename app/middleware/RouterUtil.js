let {
        getJwtVerify,
        getJwtDecrypt,
        getSplitBearerJwt
    } = require('../util/Validation'),
    {
        getApiKey
    } = require('../model/find/user/users');

let tokenPayload;

module.exports = {

    isSetUserApiKey(key) {
        return key !== undefined;
    },


    async isValidApiKey(key, phone) {
        let result = await getApiKey(phone);

        return result === key;
    },


    async tokenVerify(bearerHeader) {

        let isSetUserToken = getSplitBearerJwt(bearerHeader);

        if (typeof isSetUserToken !== 'string')
            return false;

        let token = await getJwtDecrypt(isSetUserToken);

        let decode = await getJwtVerify(token);

        if (decode.type === 'rt' || 'at')
            return tokenPayload = decode;

        return true;
    },


    async getTokenPayLoad() {
        return await tokenPayload;
    }


}