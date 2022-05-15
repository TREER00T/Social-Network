let {
        getJwtVerify,
        getJwtDecrypt,
        getSplitBearerJwt
    } = require('app/util/Validation'),
    {
        getApiKey
    } = require('app/model/find/user/users');

let refreshTokenPayload, accessTokenPayload;

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


    refreshTokenVerify(bearerHeader) {

        let isSetUserRefreshToken = getSplitBearerJwt(bearerHeader);

        if (typeof isSetUserRefreshToken === 'string') {

            (async () => {

                let token = await getJwtDecrypt(isSetUserRefreshToken);

                getJwtVerify(token, decode => {

                    if (decode.type === 'rt') {

                        module.exports.token = {
                            rt: decode
                        };

                        (function (cb) {
                            if (typeof cb === 'function')
                                cb(decode)
                        })(refreshTokenPayload);
                    }

                });

            })();

            return true;
        }

        return false;
    },


    accessTokenVerify(bearerHeader) {

        let isSetUserAccessToken = getSplitBearerJwt(bearerHeader);

        if (typeof isSetUserAccessToken === 'string') {

            (async () => {

                let token = await getJwtDecrypt(isSetUserAccessToken);

                getJwtVerify(token, decode => {

                    if (decode.type === 'at') {

                        module.exports.token = {
                            at: decode
                        };

                        (function (cb) {
                            if (typeof cb === 'function')
                                cb(decode)
                        })(accessTokenPayload);

                    }

                });
            })();

            return true;
        }

        return false;
    },


    getRefreshTokenPayLoad(cb) {
        refreshTokenPayload = (data => {
            cb(data);
        });
    },


    getAccessTokenPayLoad(cb) {
        accessTokenPayload = (data => {
            cb(data);
        });
    }


}