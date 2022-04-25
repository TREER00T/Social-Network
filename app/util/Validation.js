const {
        builder
    } = require('./ReturnJson'),
    Response = require('./Response'),
    jwt = require('jsonwebtoken'),
    {
        JWK,
        parse
    } = require('node-jose'),
    crypto = require('crypto');


module.exports = {


    // Checks phone number E.g : 09030207892 return true
    isPhoneNumber(data) {
        return /^\d+$/.test(data);
    },


    // Checks the verification code E.g : 335486 return true
    isVerificationCode(code) {
        return /^[0-9]{6}$/.test(code);
    },


    // If http method not found in httpMethod array It should be return json response
    checkHttpMethod(requestMethod) {

        const arrayOfHttpMethods = [
            'GET',
            'PUT',
            'POST',
            'PATCH',
            'DELETE'
        ];

        if (!arrayOfHttpMethods.includes(requestMethod)) {
            return builder(
                Response.HTTP_METHOD_NOT_ALLOWED.code,
                Response.HTTP_METHOD_NOT_ALLOWED
            )
        }

    },


    // The verify jwt and check jwt expired time
    getJwtVerify(token, verifyOptions, callBack) {
        jwt.verify(token, process.env.PUBLIC_KEY, verifyOptions, (err, decoded) => {

            if (err) {

                return builder(
                    Response.HTTP_UNAUTHORIZED_INVALID_TOKEN.code,
                    Response.HTTP_UNAUTHORIZED_INVALID_TOKEN
                )
            }

            if (this.isTokenExpiredError(err)) {

                return builder(
                    Response.HTTP_UNAUTHORIZED_TOKEN_EXP.code,
                    Response.HTTP_UNAUTHORIZED_TOKEN_EXP
                )
            }
            callBack(decoded);
        });
    },


    // The jwt decrypt with JWK library and return jwt
    async getJwtDecrypt(encryptedBody) {
        let keystore = JWK.createKeyStore();
        await keystore.add(await JWK.asKey(process.env.JWE_PRAIVATE_KEY, 'pem'));
        let outPut = parse.compact(encryptedBody);
        let decryptedVal = await outPut.perform(keystore);
        return Buffer.from(decryptedVal.plaintext).toString();
    },


    // Returns split jwt without bearer
    getSplitBearerJwt(bearerHeader) {
        return bearerHeader.split(' ')[2];
    },


    // search TokenExpiredError in error
    isTokenExpiredError(err) {
        return /TokenExpiredError/.test(err);
    },


    getApiKey() {
        const rand = crypto.randomBytes(50);

        let formatValidString = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        let chars = formatValidString.repeat(5);

        let str = '';

        for (let i = 0; i < rand.length; i++) {
            let decimal = rand[i];
            str += chars[decimal];
        }

        return str.trim();
    }


}