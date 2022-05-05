let {
        getJwtVerify,
        getJwtDecrypt,
        getSplitBearerJwt
    } = require('app/util/Validation'),
    Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    {
        getApiKey
    } = require('app/model/find/user/users');

let accessTokenPayload, apiKey;

module.exports = {

    userApiKey(phone, key, cb) {

        if (key === undefined || key === null)
            return cb(false);

        getApiKey(phone, result => {

            if (result !== key) {
                return cb(false);
            }

            cb(true);

            (function (cb) {
                if (typeof cb === 'function')
                    cb(key)
            })(apiKey);

        });

    },

    accessTokenVerify(bearerHeader, cb) {

        let isSetUserAccessToken = getSplitBearerJwt(bearerHeader);

        if (typeof isSetUserAccessToken !== 'string') {
            return cb(false);
        }

        cb(true);

        (async () => {

            let tokenWithDoubleQuestion = await getJwtDecrypt(isSetUserAccessToken);
            let token;
            if (tokenWithDoubleQuestion !== undefined)
                token = tokenWithDoubleQuestion.replace(/["]+/g, '');

            getJwtVerify(token, decode => {

                if (decode === 'TOKEN_EXP') {
                    return cb(Json.builder(Response.HTTP_UNAUTHORIZED_TOKEN_EXP));
                }


                if (decode.type === 'at') {

                    (function (cb) {
                        if (typeof cb === 'function')
                            cb(decode)
                    })(accessTokenPayload);

                    return;
                }

                cb('IN_VALID_TOKEN');


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