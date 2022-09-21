let {
        getJwtVerify,
        getJwtDecrypt,
        getSplitBearerJwt
    } = require('app/util/Validation'),
    {
        getApiKey
    } = require('app/model/find/user/users');

let tokenPayload;

module.exports = {

    isSetUserApiKey(key) {
        return key !== undefined;
    },


    isValidApiKey(key, phone, cb) {

        getApiKey(phone, result => {

            cb(result === key);

        });

    },


    tokenVerify(bearerHeader) {

        let isSetUserToken = getSplitBearerJwt(bearerHeader);

        if (typeof isSetUserToken !== 'string')
            return false;

        (async () => {

            let token = await getJwtDecrypt(isSetUserToken);

            getJwtVerify(token, decode => {

                if (decode.type === 'rt' || 'at') {

                    (function (cb) {
                        if (typeof cb === 'function')
                            cb(decode)
                    })(tokenPayload);
                }

            });

        })();

        return true;
    },


    getTokenPayLoad(cb) {
        tokenPayload = (data => {
            cb(data);
        });
    }


}