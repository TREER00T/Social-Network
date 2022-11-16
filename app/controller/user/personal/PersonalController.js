let Json = require('../../../util/ReturnJson'),
    {
        getTokenPayLoad
    } = require('../../../middleware/RouterUtil'),
    Response = require('../../../util/Response'),
    {
        InputException
    } = require('../../../exception/InputException'),
    Update = require('../../../model/update/user/users'),
    Find = require('../../../model/find/user/users'),
    multer = require('multer'),
    {
        NULL
    } = require('opensql').queryHelper,
    multerImage = multer().single('image'),
    multerFile = multer().single('file'),
    {
        getHashData
    } = require('../../../util/Generate'),
    File = require('../../../util/File'),
    Util, {
        isUndefined,
        getFileFormat,
        IN_VALID_MESSAGE_TYPE,
        IN_VALID_OBJECT_KEY
    } = require('../../../util/Util'),
    CommonInsert = require('../../../model/add/insert/common/index'),
    Create = require('../../../model/create/users'),
    Insert = require('../../../model/add/insert/user/users'),
    FindInUser = require('../../../model/find/user/users'),
    AddUserForeignKey = require('../../../model/add/foreignKey/users'),
    Delete = require('../../../model/remove/users/user');


module.exports = class {

    phone;
    userId;

    async init() {
        let tokenPayload = await getTokenPayLoad();
        this.phone = tokenPayload.phoneNumber;
        this.userId = tokenPayload.id;
    }

    async user() {

        this.init();

        let personalUserDetails = await Find.getPersonalUserDetails(this.userId);

        Json.builder(Response.HTTP_OK, personalUserDetails);

    }

    async editUsername(req) {

        this.init();

        let username = req.params?.id;

        if (isUndefined(username))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isExistUsername = await Find.isExistUsername(username.toString().trim());

        if (!isExistUsername)
            return Json.builder(Response.HTTP_CONFLICT);

        let result = await Update.username(this.phone, username.toString().trim());

        if (!result)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Json.builder(Response.HTTP_OK);

    }

    async editBio(req) {

        this.init();

        let bio = req.body?.bio;

        if (isUndefined(bio))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let result = await Update.bio(this.phone, bio);

        if (!result)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Json.builder(Response.HTTP_OK);

    }

    async editName(req) {

        this.init();

        let bodyObject = req.body,
            lastName = bodyObject?.lastName,
            firstName = bodyObject?.firstName;

        if (isUndefined(firstName))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let result = await Update.name(this.phone, firstName.toString().trim(), lastName);

        if (!result)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Json.builder(Response.HTTP_OK);

    }

    async twoAuth(req) {

        this.init();

        let bodyObject = req.body,
            email = bodyObject?.email,
            password = bodyObject?.password;

        if (isUndefined(email) || isUndefined(password) || password?.length < 6)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let result = await Update.passwordAndEmail(this.phone, getHashData(password, this.phone), email);

        if (!result)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Json.builder(Response.HTTP_OK);

    }

    async disableTwoAuth() {

        this.init();

        let result = await Update.passwordAndEmail(this.phone, NULL, NULL);

        if (!result)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Json.builder(Response.HTTP_OK);

    }

    async restPassword(req) {

        this.init();

        let bodyObject = req.body,
            oldPassword = bodyObject?.old,
            newPassword = bodyObject?.new;

        if (isUndefined(oldPassword) || isUndefined(newPassword))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isValidPassword = await Find.isValidPassword(this.phone, getHashData(oldPassword, this.phone));

        if (!isValidPassword)
            return Json.builder(Response.HTTP_FORBIDDEN);

        let result = await Update.password(this.phone, getHashData(newPassword, this.phone));

        if (!result)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Json.builder(Response.HTTP_OK);

    }

    async uploadAvatar(req, res) {

        this.init();

        multerImage(req, res, async () => {

            let file = req.file;

            if (isUndefined(file))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            let {
                url
            } = File.validationAndWriteFile({
                size: file.size,
                dataBinary: file.buffer,
                format: getFileFormat(file.originalname)
            });

            let result = await Update.img(this.phone, url);

            if (!result)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            Json.builder(Response.HTTP_OK);

        });

    }

    async listOfBlockUsers() {

        this.init();

        let listOfBlockUser = await Find.getListOfBlockUsers(this.userId);

        if (isUndefined(listOfBlockUser))
            return Json.builder(Response.HTTP_NOT_FOUND);

        let result = await Find.getUserDetailsInUsersTable(listOfBlockUser);

        Json.builder(Response.HTTP_OK, result);

    }

    async listOfDevices() {

        this.init();

        let devices = await Find.getListOfDevices(this.userId);
        Json.builder(Response.HTTP_OK, devices);

    }

    async listOfMessage(req) {

        this.init();

        let queryObject = req.query,
            limit = queryObject?.limit,
            page = queryObject?.page,
            order = queryObject?.order,
            sort = queryObject?.sort,
            type = queryObject?.type,
            search = queryObject?.search,
            getLimit = !isUndefined(limit) ? limit : 1,
            getSort = !isUndefined(sort) ? sort : 'DESC',
            getOrder = !isUndefined(order) ? order : 'id',
            getPage = !isUndefined(page) ? page : 1,
            startFrom = (getPage - 1) * limit;

        let isSavedMessageCreated = await FindInUser.isSavedMessageCreated(this.phone);

        if (!isSavedMessageCreated)
            return Json.builder(Response.HTTP_NOT_FOUND);

        let count = await Find.getCountOfListMessage(this.phone + 'SavedMessages');

        let totalPages = Math.ceil(count / getLimit);

        let listOfMessage = await FindInUser.getListOfMessage({
            type: type,
            sort: getSort,
            search: search,
            limit: getLimit,
            order: getOrder,
            startFrom: startFrom,
            tableName: this.phone + 'SavedMessages'
        });

        Json.builder(
            Response.HTTP_OK,
            listOfMessage, {
                totalPages: totalPages
            }
        );

    }

    async deleteSavedMessage() {

        this.init();

        let isSavedMessageCreated = await FindInUser.isSavedMessageCreated(this.phone);

        if (!isSavedMessageCreated)
            return Json.builder(Response.HTTP_NOT_FOUND);

        await Delete.savedMessage(this.phone);

        Json.builder(Response.HTTP_OK);

    }

    async createSavedMessage() {

        this.init();

        let isSavedMessageCreated = await FindInUser.isSavedMessageCreated(this.phone);

        if (isSavedMessageCreated)
            return Json.builder(Response.HTTP_CONFLICT);

        await Create.savedMessages(this.phone).then(() => AddUserForeignKey.savedMessages(this.phone));

        Json.builder(Response.HTTP_CREATED);

    }

    async account() {

        this.init();

        Json.builder(Response.HTTP_OK);

        await Delete.savedMessage(this.phone);
        await Delete.userInAllUsersBlockList(this.userId);
        await Delete.userInUsersTable(this.userId);
        await Delete.userInDevices(this.userId);
        await FindInUser.getListOfUserE2Es(this.userId).then(async result => {
            if (result !== null)
                await Delete.userInAllUsersE2E(result, this.userId);
        });
        await FindInUser.getListOfUserGroup(this.userId).then(async result => {
            if (result !== null)
                await Delete.userInAllUsersGroup(result, this.userId);
        });
        await FindInUser.getListOfUserChannel(this.userId).then(async result => {
            if (result !== null)
                await Delete.userInAllUsersChannel(result, this.userId);
        });

    }

    async addMessage(req) {

        this.init();

        let message = Util.validateMessage(req.body);

        if (message === IN_VALID_MESSAGE_TYPE || IN_VALID_OBJECT_KEY)
            return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);

        let isSavedMessageCreated = await FindInUser.isSavedMessageCreated(this.phone);

        if (!isSavedMessageCreated)
            return Json.builder(Response.HTTP_NOT_FOUND);

        await Insert.messageIntoUserSavedMessage(this.phone, message);

        Json.builder(Response.HTTP_CREATED);

    }

    async uploadFile(req, res) {

        this.init();

        let isInDb = await Find.isExist(this.userId);

        if (!isInDb)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        multerFile(req, res, async () => {

            let data = JSON.parse(JSON.stringify(req.body));

            let isSavedMessageCreated = await Find.isSavedMessageCreated(this.phone);

            if (!isSavedMessageCreated)
                return Json.builder(Response.HTTP_NOT_FOUND);

            let message = Util.validateMessage(data);

            if (message === (IN_VALID_OBJECT_KEY || IN_VALID_MESSAGE_TYPE))
                return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);

            let file = req.file;

            if (isUndefined(file))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            let {
                url,
                size
            } = File.validationAndWriteFile({
                size: file.size,
                dataBinary: file.buffer,
                format: getFileFormat(file.originalname)
            });

            message['fileUrl'] = url;
            message['fileSize'] = size;
            message['fileName'] = file.originalname;

            await CommonInsert.message('`' + this.phone + 'SavedMessages`', message, {
                conversationType: 'Personal'
            }).then(result => {
                Json.builder(Response.HTTP_OK, {
                    insertId: result
                });
            });

        });

    }

    async deleteMessage(req) {

        this.init();

        let listOfId;

        try {
            listOfId = JSON.parse(req.body.toString())['listOfId'];
        } catch (e) {
            InputException(e);
        }

        if (isUndefined(listOfId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isSavedMessageCreated = await FindInUser.isSavedMessageCreated(this.phone);

        if (!isSavedMessageCreated)
            return Json.builder(Response.HTTP_NOT_FOUND);

        await Delete.itemInSavedMessage(this.phone, listOfId);

        Json.builder(Response.HTTP_OK);

    }

    async editMessage(req) {

        this.init();

        let reqData = req.body,
            id = reqData?.id,
            dataWithOutIdObject;

        if (isUndefined(id))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        delete reqData?.id;
        dataWithOutIdObject = reqData;

        let message = Util.validateMessage(dataWithOutIdObject);

        if (message === IN_VALID_MESSAGE_TYPE || IN_VALID_OBJECT_KEY)
            return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);

        let isSavedMessageCreated = await FindInUser.isSavedMessageCreated(this.phone);

        if (!isSavedMessageCreated)
            return Json.builder(Response.HTTP_NOT_FOUND);

        await Update.itemInSavedMessage(this.phone, id, message);

        Json.builder(Response.HTTP_OK);

    }

}