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

let tokenPayload = await getTokenPayLoad();
let phone = tokenPayload.phoneNumber;
let userId = tokenPayload.id;

exports.user = async () => {

    let personalUserDetails = await Find.getPersonalUserDetails(userId);

    Json.builder(Response.HTTP_OK, personalUserDetails);

}


exports.editUsername = async req => {

    let username = req.params?.id;

    if (isUndefined(username))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let isExistUsername = await Find.isExistUsername(username.toString().trim());

    if (!isExistUsername)
        return Json.builder(Response.HTTP_CONFLICT);

    let result = await Update.username(phone, username.toString().trim());

    if (!result)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    Json.builder(Response.HTTP_OK);

}


exports.editBio = async req => {

    let bio = req.params?.bio;

    if (isUndefined(bio))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let result = await Update.bio(phone, bio);

    if (!result)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    Json.builder(Response.HTTP_OK);

}


exports.editName = async req => {

    let bodyObject = req.body,
        lastName = bodyObject?.lastName,
        firstName = bodyObject?.firstName;

    if (isUndefined(firstName))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let result = await Update.name(phone, firstName.toString().trim(), lastName);

    if (!result)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    Json.builder(Response.HTTP_OK);

}


exports.twoAuth = async req => {

    let bodyObject = req.body,
        email = bodyObject?.email,
        password = bodyObject?.password;

    if (isUndefined(email) || isUndefined(password) || password?.length < 6)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let result = await Update.passwordAndEmail(phone, getHashData(password, phone), email);

    if (!result)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    Json.builder(Response.HTTP_OK);

}


exports.disableTwoAuth = async () => {

    let result = await Update.passwordAndEmail(phone, NULL, NULL);

    if (!result)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    Json.builder(Response.HTTP_OK);

}


exports.restPassword = async req => {

    let bodyObject = req.body,
        oldPassword = bodyObject?.old,
        newPassword = bodyObject?.new;

    if (isUndefined(oldPassword) || isUndefined(newPassword))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let isValidPassword = await Find.isValidPassword(phone, getHashData(oldPassword, phone));

    if (!isValidPassword)
        return Json.builder(Response.HTTP_FORBIDDEN);

    let result = await Update.password(phone, getHashData(newPassword, phone));

    if (!result)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    Json.builder(Response.HTTP_OK);

}


exports.uploadAvatar = async (req, res) => {

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

        let result = await Update.img(phone, url);

        if (!result)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Json.builder(Response.HTTP_OK);

    });

}


exports.listOfBlockUsers = async () => {

    let listOfBlockUser = await Find.getListOfBlockUsers(userId);

    if (isUndefined(listOfBlockUser))
        return Json.builder(Response.HTTP_NOT_FOUND);

    let result = await Find.getUserDetailsInUsersTable(listOfBlockUser);

    Json.builder(Response.HTTP_OK, result);

}


exports.listOfDevices = async () => {

    let devices = await Find.getListOfDevices(userId);
    Json.builder(Response.HTTP_OK, devices);

}


exports.listOfMessage = async req => {

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

    let isSavedMessageCreated = await FindInUser.isSavedMessageCreated(phone);

    if (!isSavedMessageCreated)
        return Json.builder(Response.HTTP_NOT_FOUND);

    let count = await Find.getCountOfListMessage(phone + 'SavedMessages');

    let totalPages = Math.ceil(count / getLimit);

    let listOfMessage = await FindInUser.getListOfMessage({
        type: type,
        sort: getSort,
        search: search,
        limit: getLimit,
        order: getOrder,
        startFrom: startFrom,
        tableName: phone + 'SavedMessages'
    });

    Json.builder(
        Response.HTTP_OK,
        listOfMessage, {
            totalPages: totalPages
        }
    );

}


exports.deleteSavedMessage = async () => {

    let isSavedMessageCreated = await FindInUser.isSavedMessageCreated(phone);

    if (!isSavedMessageCreated)
        return Json.builder(Response.HTTP_NOT_FOUND);

    await Delete.savedMessage(phone);

    Json.builder(Response.HTTP_OK);

}


exports.createSavedMessage = async () => {

    let isSavedMessageCreated = await FindInUser.isSavedMessageCreated(phone);

    if (isSavedMessageCreated)
        return Json.builder(Response.HTTP_CONFLICT);

    await Create.savedMessages(phone).then(() => AddUserForeignKey.savedMessages(phone));

    Json.builder(Response.HTTP_CREATED);

}


exports.account = async () => {

    Json.builder(Response.HTTP_OK);

    await Delete.savedMessage(phone);
    await Delete.userInAllUsersBlockList(userId);
    await Delete.userInUsersTable(userId);
    await Delete.userInDevices(userId);
    await FindInUser.getListOfUserE2Es(userId).then(async result => {
        if (result !== null)
            await Delete.userInAllUsersE2E(result, userId);
    });
    await FindInUser.getListOfUserGroup(userId).then(async result => {
        if (result !== null)
            await Delete.userInAllUsersGroup(result, userId);
    });
    await FindInUser.getListOfUserChannel(userId).then(async result => {
        if (result !== null)
            await Delete.userInAllUsersChannel(result, userId);
    });

}


exports.addMessage = async req => {

    let message = Util.validateMessage(req.body);

    if (message === IN_VALID_MESSAGE_TYPE || IN_VALID_OBJECT_KEY)
        return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);

    let isSavedMessageCreated = await FindInUser.isSavedMessageCreated(phone);

    if (!isSavedMessageCreated)
        return Json.builder(Response.HTTP_NOT_FOUND);

    await Insert.messageIntoUserSavedMessage(phone, message);

    Json.builder(Response.HTTP_CREATED);

}


exports.uploadFile = async (req, res) => {

    let isInDb = await Find.isExist(userId);

    if (!isInDb)
        return Json.builder(Response.HTTP_USER_NOT_FOUND);

    multerFile(req, res, async () => {

        let data = JSON.parse(JSON.stringify(req.body));

        let isSavedMessageCreated = await Find.isSavedMessageCreated(phone);

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

        await CommonInsert.message('`' + phone + 'SavedMessages`', message, {
            conversationType: 'Personal'
        }).then(result => {
            Json.builder(Response.HTTP_OK, {
                insertId: result
            });
        });

    });

}


exports.deleteMessage = async req => {

    let listOfId;

    try {
        listOfId = JSON.parse(req.body.toString())['listOfId'];
    } catch (e) {
        InputException(e);
    }

    if (isUndefined(listOfId))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let isSavedMessageCreated = await FindInUser.isSavedMessageCreated(phone);

    if (!isSavedMessageCreated)
        return Json.builder(Response.HTTP_NOT_FOUND);

    await Delete.itemInSavedMessage(phone, listOfId);

    Json.builder(Response.HTTP_OK);

}


exports.editMessage = async req => {

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

    let isSavedMessageCreated = await FindInUser.isSavedMessageCreated(phone);

    if (!isSavedMessageCreated)
        return Json.builder(Response.HTTP_NOT_FOUND);

    await Update.itemInSavedMessage(phone, id, message);

    Json.builder(Response.HTTP_OK);

}