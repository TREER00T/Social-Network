let Json = require('../../../util/ReturnJson'),
    Response = require('../../../util/Response'),
    {isUndefined, getRandomHexColor} = require('../../../util/Util'),
    Update = require('../../../model/update/user'),
    Insert = require('../../../model/add/user'),
    Find = require('../../../model/find/user'),
    CreateUser = require('../../../model/create/user'),
    {
        isPhoneNumber,
        isVerificationCode
    } = require('../../../util/Validation'),
    {
        getRandomHash,
        getJwtSign,
        getHashData,
        getJwtEncrypt,
        getVerificationCode
    } = require('../../../util/Generate'),
    {
        getTokenPayLoad
    } = require('../../../middleware/RouterUtil');


module.exports = class {

    userId;
    phone;

    async init() {
        let tokenPayload = await getTokenPayLoad();
        this.userId = tokenPayload.id;
        this.phone = tokenPayload.phoneNumber;
    }

    async gvc(req) {

        let phone = req.body?.phone;

        if (!isPhoneNumber(phone))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isInDb = await Find.userPhone(phone);

        if (!isInDb) {
            await CreateUser.savedMessage(phone);

            let isAdded = await Insert.phoneAndAuthCode(phone, getVerificationCode(), getRandomHexColor());

            if (!isAdded)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            return Json.builder(Response.HTTP_CREATED);
        }

        let isUpdated = await Update.authCode(phone, getVerificationCode());

        if (!isUpdated)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Json.builder(Response.HTTP_OK);
    }

    async isValidAuthCode(req) {

        let bodyObject = req.body,
            phone = bodyObject?.phone,
            authCode = bodyObject?.authCode,
            deviceIp = bodyObject?.deviceIp,
            deviceName = bodyObject?.deviceName,
            deviceLocation = bodyObject?.deviceLocation;

        if ((!isPhoneNumber(phone) && !isVerificationCode(authCode)) ||
            (isUndefined(deviceName) || isUndefined(deviceIp) || isUndefined(deviceLocation)))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isValidAuthCode = await Find.isValidAuthCode(phone, authCode);

        if (!isValidAuthCode)
            return Json.builder(Response.HTTP_UNAUTHORIZED);

        let password = await Find.password(phone);

        if (password) {

            let user = await Find.getApiKeyAndUserId(phone);

            await Insert.userDeviceInformation({
                id: user.id,
                ip: deviceIp,
                name: deviceName,
                location: deviceLocation
            });

            return Json.builder(Response.HTTP_ACCEPTED, {
                accessToken: await getJwtEncrypt(getJwtSign({
                    phoneNumber: `${phone}`,
                    id: `${user.id}`,
                    expiresIn: '12h',
                    type: 'at'
                }, phone)),
                refreshToken: await getJwtEncrypt(getJwtSign({
                    phoneNumber: `${phone}`,
                    id: `${user.id}`,
                    expiresIn: '1d',
                    type: 'rt'
                }, phone)),
                apiKey: user.apiKey
            });

        }

        let apiKey = await Find.getApiKey(phone);

        if (!isUndefined(apiKey))
            return Json.builder(Response.HTTP_OK_BUT_TWO_STEP_VERIFICATION);

        let newApiKey = await Update.apikey(phone, getRandomHash(50));

        if (!newApiKey)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Json.builder(Response.HTTP_OK_BUT_TWO_STEP_VERIFICATION);

    }

    async isValidPassword(req) {

        this.init();

        let bodyObject = req?.body,
            password = bodyObject?.password,
            deviceIp = bodyObject?.deviceIp,
            deviceName = bodyObject?.deviceName,
            deviceLocation = bodyObject?.deviceLocation;

        if (isUndefined(password) || password?.length < 6 || isUndefined(deviceName) ||
            isUndefined(deviceIp) || isUndefined(deviceLocation))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isValidPassword = await Find.isValidPassword(this.phone, getHashData(password.trim(), this.phone));

        if (!isValidPassword)
            return Json.builder(Response.HTTP_FORBIDDEN);

        let user = await Find.getApiKeyAndUserId(this.phone);

        await Insert.userDeviceInformation({
            id: user.id,
            ip: deviceIp,
            name: deviceName,
            location: deviceLocation
        });

        Json.builder(Response.HTTP_ACCEPTED, {
            apiKey: user.apiKey
        });

    }

    async refreshToken() {

        this.init();

        let isInDb = await Find.userPhone(this.phone);

        if (!isInDb)
            return Json.builder(Response.HTTP_FORBIDDEN);

        Json.builder(Response.HTTP_ACCEPTED, {
            accessToken: await getJwtEncrypt(getJwtSign({
                phoneNumber: `${this.phone}`,
                id: `${this.userId}`,
                expiresIn: '12h',
                type: 'at'
            }, this.phone)),
            refreshToken: await getJwtEncrypt(getJwtSign({
                phoneNumber: `${this.phone}`,
                id: `${this.userId}`,
                expiresIn: '1d',
                type: 'rt'
            }, this.phone))
        });

    }

}