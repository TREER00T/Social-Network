const {
        isPhoneNumber, isVerificationCode,
        getSplitBearerJwt, getJwtDecrypt, getJwtVerify
    } = require('../Util/Validation'),
    Database = require('../model/DatabaseOpenHelper'),
    {builder, initialization} = require('../Util/ReturnJson'),
    {
        getJwtEncrypt, getJwtSign, getJwtRefresh,
        getVerificationCode
    } = require('../Util/Generate'),
    Response = require('../Util/Response');


exports.generateVerificationCodeAndGetPhoneNumber = (req, res) => {

    initialization(res);

    let phoneNumber = req.body.phoneNumber;

    if (!isPhoneNumber(phoneNumber)) return builder(Response.HTTP_BAD_REQUEST.code, Response.HTTP_BAD_REQUEST);

    return Database.insertPhoneAndVerificationCode(phoneNumber, getVerificationCode(), (result) => {

        if (result) return builder(Response.HTTP_CREATED.code, Response.HTTP_CREATED);

        return Database.updateVerificationCode(phoneNumber, getVerificationCode(), (result) => {

            if (result) return builder(Response.HTTP_OK.code, Response.HTTP_OK);

        });


    });


}

exports.checkVerificationCodeInDatabaseAndSingUpOrLogin = (req, res) => {

    initialization(res);

    let {phoneNumber, verificationCode} = req.body;

    if (!isPhoneNumber(phoneNumber) && !isVerificationCode(verificationCode)) {
        return builder(
            Response.HTTP_BAD_REQUEST.code,
            Response.HTTP_BAD_REQUEST
        )
    }
    return Database.checkVerificationCode(phoneNumber, verificationCode, (result) => {

        if (!result) return builder(Response.HTTP_UNAUTHORIZED.code, Response.HTTP_UNAUTHORIZED);

        (async () => {
            builder(
                Response.HTTP_ACCEPTED.code,
                Response.HTTP_ACCEPTED,
                {
                    'accessToken': await getJwtEncrypt(getJwtSign({
                        'phoneNumber': `${phoneNumber}`,
                        type: 'at'
                    }, phoneNumber)),
                    'refreshToken': await getJwtEncrypt(getJwtRefresh({
                        'phoneNumber': `${phoneNumber}`,
                        type: 'rt'
                    }, phoneNumber))
                }
            )
        })()

    });

}

exports.test = (req, res) => {
    initialization(res);
    let bearerHeader = req.headers['authorization'];
    (async () => {
        let token = await getJwtDecrypt(getSplitBearerJwt(bearerHeader))
        getJwtVerify(token.replace(/["]+/g, ''), {}, (decoded) => {

            if (Date.now() >= decoded.exp * 1000) {
                console.log('yes');
            }
        })
    })()
}
