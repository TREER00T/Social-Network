let {
        getJwtVerify,
        getJwtDecrypt,
        getSplitBearerJwt
    } = require('app/util/Validation'),
    {
        getApiKey
    } = require('app/model/find/user/users');

let accessTokenPayload, apiKey;

module.exports = {

    userApiKey(phone, key, cb) {

        if (key === undefined || key === null)
            return cb(false);

        getApiKey(phone, result => {

            cb(result === key);

            (function (cb) {
                if (typeof cb === 'function')
                    cb(key)
            })(apiKey);

        });

    },

    accessTokenVerify(bearerHeader, cb) {

        let isSetUserAccessToken = getSplitBearerJwt(bearerHeader);

        if (typeof isSetUserAccessToken !== 'string')
            return cb(false);

        cb(true);

        (async () => {

            let token = await getJwtDecrypt(isSetUserAccessToken);

            getJwtVerify(token, decode => {


                if (decode === 'TOKEN_EXP')
                    return cb('TOKEN_EXP');


                if (decode === 'IN_VALID_TOKEN')
                    return cb('IN_VALID_TOKEN');



                if (decode.type === 'at') {

                    (function (cb) {
                        if (typeof cb === 'function')
                            cb(decode)
                    })(accessTokenPayload);

                }

            });

        })();

    },


    getAccessTokenPayLoad(cb) {
        accessTokenPayload = (data => {
            cb(data);
        });
    },


    getApiKey(cb) {
        apiKey = (data => {
            cb(data);
        });
    }


}