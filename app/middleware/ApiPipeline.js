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

        if (key === undefined)
            return false;

        module.exports.apiKey = key;

        return true;
    },


    isValidApiKey(key, phone, cb) {

        getApiKey(phone, result => {

            if (result !== key) {
                return cb(false);
            }

            cb(true);
        });

    },


    tokenVerify(bearerHeader) {

        let isSetUserToken = getSplitBearerJwt(bearerHeader);

        if (typeof isSetUserToken === 'string') {

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
        }

        return false;
    },


    getTokenPayLoad(cb) {
        tokenPayload = (data => {
            cb(data);
        });
    }


}