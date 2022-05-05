const Json = require('./ReturnJson'),
    Response = require('./Response'),
    jwt = require('jsonwebtoken'),
    {
        JWK,
        parse
    } = require('node-jose'),
    {
        ValidationException
    } = require('app/exception/ValidationException'),
    {
        TokenExpiredError
    } = require('jsonwebtoken');


module.exports = {


    // Checks phone number E.g : 09030207892 return true
    isPhoneNumber(data) {
        try {
            return /^\d+$/.test(data);
        } catch (e) {
            ValidationException(e);
        }
    },


    // Checks the verification code E.g : 335486 return true
    isVerificationCode(code) {
        try {
            return /^[0-9]{6}$/.test(code);
        } catch (e) {
            ValidationException(e);
        }
    },


    // If http method not found in httpMethod array It should be return json response
    isValidHttpMethod(requestMethod) {

        const arrayOfHttpMethods = [
            'GET',
            'PUT',
            'POST',
            'PATCH',
            'DELETE'
        ];

        if (!arrayOfHttpMethods.includes(requestMethod))
            return Json.builder(Response.HTTP_METHOD_NOT_ALLOWED);

    },


    // The verify jwt and check jwt expired time
    getJwtVerify(token, cb) {
        try {
            jwt.verify(token, process.env.PUBLIC_KEY, {}, (err, decoded) => {

                if (err !== null && err instanceof TokenExpiredError) {
                    cb('TOKEN_EXP');
                    return Json.builder(Response.HTTP_UNAUTHORIZED_TOKEN_EXP);
                }

                cb(decoded);
            });
        } catch (e) {
            ValidationException(e);
        }

    },


    // The jwt decrypt with JWK library and return jwt
    async getJwtDecrypt(encryptedBody) {
        try {
            let keystore = JWK.createKeyStore();
            await keystore.add(await JWK.asKey(process.env.JWE_PRAIVATE_KEY, 'pem'));
            let outPut = parse.compact(encryptedBody);
            let decryptedVal = await outPut.perform(keystore);
            let token = Buffer.from(decryptedVal.plaintext).toString();

            if (typeof decryptedVal.plaintext === ('undefined' || null))
                return Json.builder(Response.HTTP_UNAUTHORIZED_INVALID_TOKEN);

            return token;
        } catch (e) {
            ValidationException(e);
        }
    },


    // Returns split jwt without bearer
    getSplitBearerJwt(bearerHeader) {
        try {
            let token = bearerHeader.split(' ')[1];
            if ((token !== null || typeof token !== 'undefined')
                && typeof bearerHeader !== 'undefined')
                return token;
            return false;
        } catch (e) {
            ValidationException(e);
        }
    }


}