const Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    Update = require('app/model/update/user/users'),
    Insert = require('app/model/add/insert/user/users'),
    Find = require('app/model/find/user/users'),
    {
        isPhoneNumber,
        isVerificationCode
    } = require('app/util/Validation'),
    {
        getJwtSign,
        getJwtRefresh,
        getJwtEncrypt,
        getVerificationCode
    } = require('app/util/Generate');


exports.gvc = (req, res) => {

    Json.initializationRes(res);

    let phone = req.body.phone;

    if (!isPhoneNumber(phone))
        return Json.builder(Response.HTTP_BAD_REQUEST);


    Find.userPhone(phone, (isInDb) => {

        if (!isInDb) {
            Insert.phoneAndAuthCode(phone, getVerificationCode(), (isAdded) => {
                if (isAdded)
                    return Json.builder(Response.HTTP_CREATED);
            });
        }

        if (isInDb) {
            Update.authCode(phone, getVerificationCode(), (isUpdated) => {
                if (isUpdated)
                    return Json.builder(Response.HTTP_OK);
            });
        }


    });


}


exports.isValidAuthCode = (req, res) => {


    Json.initializationRes(res);

    let {phone, authCode} = req.body;

    if (!isPhoneNumber(phone) && !isVerificationCode(authCode))
        return Json.builder(Response.HTTP_BAD_REQUEST)

    Find.isValidAuthCode(phone, authCode, (result) => {

        if (!result)
            return Json.builder(Response.HTTP_UNAUTHORIZED);

        (async () => {
            Json.builder(
                Response.HTTP_ACCEPTED,
                {
                    'accessToken': await getJwtEncrypt(getJwtSign({
                        'phoneNumber': `${phone}`,
                        type: 'at'
                    }, phone)),
                    'refreshToken': await getJwtEncrypt(getJwtRefresh({
                        'phoneNumber': `${phone}`,
                        type: 'rt'
                    }, phone))
                }
            )
        })();


    });


}