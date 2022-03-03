const {builder} = require('./ReturnJson'),
    Response = require('./Response'),
    jwt = require('jsonwebtoken'),
    {JWK, parse} = require('node-jose');


// Checks phone number E.g : 09030207892 return true
exports.isPhoneNumber = (number) => /^09[0-9]{9}$/.test(number);

// Checks the verification code E.g : 335486 return true
exports.isVerificationCode = (code) => /^[0-9]{6}$/.test(code);

// If http method not found in httpMethod array It should be return json response
exports.checkHttpMethod = (requestMethod) => {

    const httpMethod = [
        'GET',
        'PUT',
        'POST',
        'PATCH',
        'DELETE'
    ];
    if (!httpMethod.includes(requestMethod)) {
        return builder(Response.HTTP_METHOD_NOT_ALLOWED);
    }


}

// The verify jwt and check jwt expired time
exports.getJwtVerify = (token, verifyOptions, callBack) => {

    jwt.verify(token, process.env.PUBLIC_KEY, verifyOptions, (err, decoded) => {

        if (err) {

            return builder(
                Response.HTTP_UNAUTHORIZED_INVALID_TOKEN
            );
        }

        if (this.isTokenExpiredError(err)) {

            return builder(
                Response.HTTP_UNAUTHORIZED_TOKEN_EXP
            )
        }
        callBack(decoded);
    });
}

// The jwt decrypt with JWK library and return jwt
exports.getJwtDecrypt = async (encryptedBody) => {
    let keystore = JWK.createKeyStore();
    await keystore.add(await JWK.asKey(process.env.JWE_PRAIVATE_KEY, 'pem'));
    let outPut = parse.compact(encryptedBody);
    let decryptedVal = await outPut.perform(keystore);
    return Buffer.from(decryptedVal.plaintext).toString();
}

// Returns split jwt without bearer
exports.getSplitBearerJwt = (bearerHeader) => bearerHeader.split(' ')[2];


// search TokenExpiredError in error
exports.isTokenExpiredError = (err) => /TokenExpiredError/.test(err);
