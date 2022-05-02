const {
        getJwtVerify,
        getJwtDecrypt,
        getSplitBearerJwt
    } = require('app/util/Validation'),
    Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response');

let payload, apiKey;

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


    isSetUserAccessToken(bearerHeader) {

        if (bearerHeader === undefined)
            return false;


        (async () => {

            let tokenWithDoubleQuotation = await getJwtDecrypt(getSplitBearerJwt(bearerHeader));
            let token = tokenWithDoubleQuotation.replace(/["]+/g, '');

            getJwtVerify(token, (decode) => {

                if (decode.type !== 'at')
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                (function (cb) {
                    if (typeof cb === 'function')
                        cb(decode)
                })(payload);

            });

        })();

        return true;
    },


    isSetUserRefreshToken(bearerHeader) {

        if (bearerHeader === undefined)
            return false;


        (async () => {

            let tokenWithDoubleQuotation = await getJwtDecrypt(getSplitBearerJwt(bearerHeader));
            let token = tokenWithDoubleQuotation.replace(/["]+/g, '');

            getJwtVerify(token, (decode) => {

                if (decode.type !== 'rt')
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                (function (cb) {
                    if (typeof cb === 'function')
                        cb(decode)
                })(payload);

            });

        })();

        return true;
    },


    getRefreshTokenPayLoad(cb) {
        payload = ((data) => {
            cb(data);
        });
    },


    getAccessTokenPayLoad(cb) {
        payload = ((data) => {
            cb(data);
        });
    },


    getApiKey(cb) {
        apiKey = ((data) => {
            cb(data);
        });
    }


}