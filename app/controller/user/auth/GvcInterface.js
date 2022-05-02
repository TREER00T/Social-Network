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
        getApiKey,
        getJwtSign,
        getHashData,
        getJwtRefresh,
        getJwtEncrypt,
        getVerificationCode
    } = require('app/util/Generate'),
    {
        getAccessTokenPayLoad,
        getRefreshTokenPayLoad
    } = require('app/routes/Pipeline');


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


        Find.password(phone, (result) => {


            if (result) {

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

                return;
            }

            Update.apikey(phone, getHashData(getApiKey(), phone), result => {

                if (result)
                    Json.builder(Response.HTTP_OK_BUT_TWO_STEP_VERIFICATION);

            });


        });

    });


}


exports.isValidPassWord = (req, res) => {

    Json.initializationRes(res);

    getAccessTokenPayLoad((data) => {

        let phone = data.phoneNumber;
        let password = req.body.password;


        Find.isValidPassword(phone, getHashData(password, phone), (result) => {


            if (!result)
                return Json.builder(Response.HTTP_FORBIDDEN);


            Find.getApiKey(phone, (result) => {

                return Json.builder(HTTP_ACCEPTED, {
                    'apiKey': result
                });

            });


        });

    });

}


exports.refreshToken = (req, res) => {


    Json.initializationRes(res);


    getRefreshTokenPayLoad((data) => {

        let phone = data.phoneNumber;


        Find.userPhone(phone, (isInDb) => {

            if (!isInDb)
                return Json.builder(Response.HTTP_FORBIDDEN);


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

    });


}