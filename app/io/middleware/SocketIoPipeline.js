let {
        getJwtVerify,
        getJwtDecrypt,
        getSplitBearerJwt
    } = require('../../util/Validation'),
    {
        getApiKey
    } = require('../../model/find/user/users');

let accessTokenPayload, apiKey;

module.exports = {

    async userApiKey(phone, key) {

        if (!key)
            return false;

        let result = await getApiKey(phone);

        apiKey = result;

        return result === key;
    },

    async accessTokenVerify(bearerHeader) {

        let isSetUserAccessToken = getSplitBearerJwt(bearerHeader);

        if (typeof isSetUserAccessToken !== 'string')
            return false;

        let token = await getJwtDecrypt(isSetUserAccessToken);

        let decode = await getJwtVerify(token);

        if (decode === 'TOKEN_EXP')
            return 'TOKEN_EXP';

        if (decode === 'IN_VALID_TOKEN')
            return 'IN_VALID_TOKEN';

        accessTokenPayload = decode;

        return decode.type === 'at';
    },


    async getAccessTokenPayLoad() {
        return await accessTokenPayload;
    },


    async getApiKey() {
        return await apiKey;
    }


}