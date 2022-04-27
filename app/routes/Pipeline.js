const {
    getJwtVerify,
    getJwtDecrypt,
    getSplitBearerJwt
} = require('app/util/Validation');

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


    isSetUserToken(bearerHeader) {

        if (bearerHeader === undefined)
            return false;


        (async () => {

            let tokenWithDoubleQuotation = await getJwtDecrypt(getSplitBearerJwt(bearerHeader));
            let token = tokenWithDoubleQuotation.replace(/["]+/g, '');

            getJwtVerify(token, (decode) => {

                (function (cb) {
                    if (typeof cb === 'function')
                        cb(decode)
                })(payload);

            });

        })();

        return true;
    },


    getTokenPayLoad(cb) {
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