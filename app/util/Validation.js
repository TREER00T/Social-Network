const Json = require('./ReturnJson'),
    Response = require('./Response'),
    jwt = require('jsonwebtoken'),
    {
        JWK,
        parse
    } = require('node-jose');


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
    isValidHttpMethod(requestMethod) {

        const arrayOfHttpMethods = [
            'GET',
            'PUT',
            'POST',
            'PATCH',
            'DELETE'
        ];

        if (!arrayOfHttpMethods.includes(requestMethod)) {
            return Json.builder(
                Response.HTTP_METHOD_NOT_ALLOWED
            )
        }

    },


    // The verify jwt and check jwt expired time
    getJwtVerify(token, cb) {
        jwt.verify(token, process.env.PUBLIC_KEY, {}, (err, decoded) => {

            if (err) {

                return Json.builder(
                    Response.HTTP_UNAUTHORIZED_INVALID_TOKEN
                )
            }

            if (Date.now() >= decoded.exp * 1000) {

                return Json.builder(
                    Response.HTTP_UNAUTHORIZED_TOKEN_EXP
                )
            }

            cb(decoded);
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
        return bearerHeader.split(' ')[1];
    }


}