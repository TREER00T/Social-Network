let Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    Util = require('app/util/util'),
    Update = require('app/model/update/user/users'),
    Insert = require('app/model/add/insert/user/users'),
    Find = require('app/model/find/user/users'),
    CreateUser = require('app/model/create/users'),
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
    } = require('app/middleware/ApiPipeline'),
    AddUserForeignKey = require('app/model/add/foreignKey/users');


exports.gvc = (req, res) => {

    Json.initializationRes(res);

    let phone = req.body.phone;

    if (!isPhoneNumber(phone))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    Find.userPhone(phone, isInDb => {

        if (!isInDb) {

            CreateUser.savedMessages(phone);
            AddUserForeignKey.savedMessages(phone);

            Insert.phoneAndAuthCode(phone, getVerificationCode(), Util.getRandomHexColor(), isAdded => {
                if (isAdded)
                    return Json.builder(Response.HTTP_CREATED);
            });

        }

        if (isInDb) {
            Update.authCode(phone, getVerificationCode(), isUpdated => {
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

    Find.isValidAuthCode(phone, authCode, result => {

        if (!result)
            return Json.builder(Response.HTTP_UNAUTHORIZED);


        Find.password(phone, result => {

            if (result) {

                return Find.getUserId(phone, id => {

                    Find.getApiKey(phone, result => {

                        (async () => {

                            Json.builder(
                                Response.HTTP_ACCEPTED,
                                {
                                    accessToken: await getJwtEncrypt(getJwtSign({
                                        phoneNumber: `${phone}`,
                                        id: `${id}`,
                                        type: 'at'
                                    }, phone)),
                                    refreshToken: await getJwtEncrypt(getJwtRefresh({
                                        phoneNumber: `${phone}`,
                                        id: `${id}`,
                                        type: 'rt'
                                    }, phone)),
                                    apiKey: result
                                }
                            )

                        })();

                    });

                });

            }

            Find.getApiKey(phone, result => {

                if (result === undefined || result === null) {

                    return Update.apikey(phone, getApiKey(), result => {

                        if (result)
                            Json.builder(Response.HTTP_OK_BUT_TWO_STEP_VERIFICATION);

                    });

                }

                Json.builder(Response.HTTP_OK_BUT_TWO_STEP_VERIFICATION);

            });


        });

    });


}


exports.isValidPassword = (req, res) => {

    Json.initializationRes(res);

    getAccessTokenPayLoad(data => {


        let phone = data.phoneNumber;
        let password = req.body.password;

        let iPasswordNull = (password === undefined || password?.length === 0);

        if (iPasswordNull)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Find.isValidPassword(phone, getHashData(password.trim(), phone), result => {


            if (!result)
                return Json.builder(Response.HTTP_FORBIDDEN);


            Find.getApiKey(phone, result => {

                return Json.builder(Response.HTTP_ACCEPTED, {
                    apiKey: result
                });

            });


        });

    });


}


exports.refreshToken = (req, res) => {


    Json.initializationRes(res);


    getRefreshTokenPayLoad(data => {

        let phone = data.phoneNumber;
        let id = data.id;


        Find.userPhone(phone, isInDb => {

            if (!isInDb)
                return Json.builder(Response.HTTP_FORBIDDEN);


            (async () => {

                Json.builder(
                    Response.HTTP_ACCEPTED,
                    {
                        accessToken: await getJwtEncrypt(getJwtSign({
                            phoneNumber: `${phone}`,
                            id: `${id}`,
                            type: 'at'
                        }, phone)),
                        refreshToken: await getJwtEncrypt(getJwtRefresh({
                            phoneNumber: `${phone}`,
                            id: `${id}`,
                            type: 'rt'
                        }, phone))
                    }
                )

            })();

        });

    });


}