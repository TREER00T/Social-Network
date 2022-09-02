let Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    Util, {isUndefined} = require('app/util/Util'),
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
        getTokenPayLoad
    } = require('app/middleware/ApiPipeline'),
    AddUserForeignKey = require('app/model/add/foreignKey/users');


exports.gvc = (req) => {


    let phone = req.body?.phone;

    if (!isPhoneNumber(phone))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    Find.userPhone(phone, isInDb => {

        if (!isInDb) {

            CreateUser.savedMessages(phone);
            AddUserForeignKey.savedMessages(phone);

            Insert.phoneAndAuthCode(phone, getVerificationCode(), Util.getRandomHexColor(), isAdded => {
                if (!isAdded)
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                Json.builder(Response.HTTP_CREATED);
            });

        }

        if (isInDb) {
            Update.authCode(phone, getVerificationCode(), isUpdated => {
                if (!isUpdated)
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                Json.builder(Response.HTTP_OK);
            });
        }


    });


}


exports.isValidAuthCode = (req) => {

    let bodyObject = req.body,
        phone = bodyObject?.phone,
        authCode = bodyObject?.authCode,
        deviceName = bodyObject?.deviceName,
        deviceIp = bodyObject?.deviceIp,
        deviceLocation = bodyObject?.deviceLocation;

    if ((!isPhoneNumber(phone) && !isVerificationCode(authCode)) ||
        (isUndefined(deviceName) || isUndefined(deviceIp) || isUndefined(deviceLocation)))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    Find.isValidAuthCode(phone, authCode, result => {

        if (!result)
            return Json.builder(Response.HTTP_UNAUTHORIZED);


        Find.password(phone, result => {

            if (result) {

                return Find.getApiKeyAndUserId(phone, result => {

                    Insert.userDeviceInformation({
                        id: result.id,
                        ip: deviceIp,
                        name: deviceName,
                        location: deviceLocation
                    });

                    (async () => {

                        Json.builder(
                            Response.HTTP_ACCEPTED,
                            {
                                accessToken: await getJwtEncrypt(getJwtSign({
                                    phoneNumber: `${phone}`,
                                    id: `${result.id}`,
                                    type: 'at'
                                }, phone)),
                                refreshToken: await getJwtEncrypt(getJwtRefresh({
                                    phoneNumber: `${phone}`,
                                    id: `${result.id}`,
                                    type: 'rt'
                                }, phone)),
                                apiKey: result.apiKey
                            }
                        )

                    })();

                });

            }

            Find.getApiKey(phone, result => {

                if (!isUndefined(result))
                    return Json.builder(Response.HTTP_OK_BUT_TWO_STEP_VERIFICATION);


                Update.apikey(phone, getApiKey(), result => {

                    if (!result)
                        return Json.builder(Response.HTTP_BAD_REQUEST);

                    Json.builder(Response.HTTP_OK_BUT_TWO_STEP_VERIFICATION);
                });


            });


        });

    });


}


exports.isValidPassword = (req) => {

    let bodyObject = req?.body,
        deviceName = bodyObject?.deviceName,
        password = bodyObject?.password,
        deviceIp = bodyObject?.deviceIp,
        deviceLocation = bodyObject?.deviceLocation;

    if (isUndefined(password) || password?.length < 6 || isUndefined(deviceName) ||
        isUndefined(deviceIp) || isUndefined(deviceLocation))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {


        let phone = data.phoneNumber;

        Find.isValidPassword(phone, getHashData(password.trim(), phone), result => {


            if (!result)
                return Json.builder(Response.HTTP_FORBIDDEN);


            Find.getApiKeyAndUserId(phone, result => {

                Insert.userDeviceInformation({
                    id: result.id,
                    ip: deviceIp,
                    name: deviceName,
                    location: deviceLocation
                });

                Json.builder(Response.HTTP_ACCEPTED, {
                    apiKey: result.apiKey
                });

            });

        });

    });


}


exports.refreshToken = () => {


    getTokenPayLoad(data => {

        let phone = data.phoneNumber,
            id = data.id;


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