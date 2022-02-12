var { json }            = require('./ReturnJson'),
    Response            = require('./Response'),
    jwt                 = require('jsonwebtoken'),
    { JWK, parse }      = require('node-jose');



exports.isPhoneNumber = (number)=>{
    return /^09[0-9]{9}$/.test(number);
}

exports.isVerificationCode = (code)=>{
    return /^[0-9]{6}$/.test(code);
}

exports.httpMethod = (res,requestMethod)=>{
    var httpMethod = [
         'GET',
         'PUT',
         'POST',
         'PATCH',
         'DELETE'
    ];
    if(!httpMethod.includes(requestMethod)){
        return json(res,
            Response.HTTP_METHOD_NOT_ALLOWED
        );
    }
 
}

exports.jwtVerify = (res,token,verifyOptions,callBack)=>{
    jwt.verify(token, process.env.PUBLIC_KEY,verifyOptions, (err, decoded) =>{
        if(err){
            if(this.isTokenExpiredError(err)){
                return json(res,
                    Response.HTTP_UNAUTHORIZED_TOKEN_EXP
                )
            }
            json(res,
                Response.HTTP_UNAUTHORIZED_INVALID_TOKEN
            );
        }
        callBack(decoded);
   });
}

exports.jwtDecrypt = async (encryptedBody) => {
    let keystore = JWK.createKeyStore();
    await keystore.add(await JWK.asKey(process.env.JWE_PRAIVATE_KEY, 'pem'));
    let outPut = parse.compact(encryptedBody);
    let decryptedVal = await outPut.perform(keystore);
    let claims = Buffer.from(decryptedVal.plaintext).toString();
    return claims;
}

exports.splitBeararJwt = (bearerHeader)=>{
    return bearerHeader.split(' ')[2];
}

exports.isTokenExpiredError = (err)=>{
    return /TokenExpiredError/.test(err);
}