let {
        getJwtVerify,
        getJwtDecrypt,
        getSplitBearerJwt
    } = require('app/util/Validation'),
    Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response');

let refreshTokenPayload, accessTokenPayload, apiKey;

module.exports = {

    isSetUserApiKey(key) {

        if (key === undefined)
            return false;

        (function (cb) {
            if (typeof cb === 'function')
                cb(key)
        })(apiKey);

        return true;
    },


    refreshTokenVerify(bearerHeader) {

        let isSetUserRefreshToken = getSplitBearerJwt(bearerHeader);

        if (typeof isSetUserRefreshToken === 'string') {

            (async () => {

                let tokenWithDoubleQuestion = await getJwtDecrypt(isSetUserRefreshToken);
                let token;
                if (tokenWithDoubleQuestion !== undefined)
                    token = tokenWithDoubleQuestion.replace(/["]+/g, '');

                getJwtVerify(token, decode => {

                    if (decode.type === 'rt') {

                        (function (cb) {
                            if (typeof cb === 'function')
                                cb(decode)
                        })(refreshTokenPayload);

                        return;
                    }

                    Json.builder(Response.HTTP_BAD_REQUEST);

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

                let tokenWithDoubleQuestion = await getJwtDecrypt(isSetUserAccessToken);
                let token;
                if (tokenWithDoubleQuestion !== undefined)
                    token = tokenWithDoubleQuestion.replace(/["]+/g, '');

                getJwtVerify(token, decode => {

                    if (decode.type === 'at') {

                        (function (cb) {
                            if (typeof cb === 'function')
                                cb(decode)
                        })(accessTokenPayload);

                        return;
                    }

                    Json.builder(Response.HTTP_BAD_REQUEST);
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
    },


    getApiKey(cb) {
        apiKey = (data => {
            cb(data);
        });
    }


}