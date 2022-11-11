let Json = require('../../util/ReturnJson'),
    Response = require('../../util/Response'),
    multer = require('multer'),
    InsertInGroup = require('../../model/add/insert/groups/group'),
    InsertInUser = require('../../model/add/insert/user/users'),
    Create = require('../../model/create/groups'),
    FindInGroup = require('../../model/find/groups/group'),
    FindInUser = require('../../model/find/user/users'),
    DeleteInGroup = require('../../model/remove/groups/group'),
    CommonInsert = require('../../model/add/insert/common/index'),
    UpdateInGroup = require('../../model/update/groups/group'),
    AddGroupForeignKey = require('../../model/add/foreignKey/groups'),
    DeleteInUser = require('../../model/remove/users/user'),
    multerImage = multer().single('image'),
    multerFile = multer().single('file'),
    {
        getTokenPayLoad
    } = require('../../middleware/RouterUtil'),
    File = require('../../util/File'),
    Util, {
        isUndefined,
        getFileFormat,
        getRandomHexColor,
        IN_VALID_MESSAGE_TYPE,
        IN_VALID_OBJECT_KEY
    } = require('../../util/Util'),
    Generate = require('../../util/Generate');


let tokenPayload = await getTokenPayLoad();
let userId = tokenPayload.id;


let validationGroupAndUser = async (roomId, userId) => {

        let isDefined = await FindInGroup.id(roomId);

        if (!isDefined) {
            Json.builder(Response.HTTP_NOT_FOUND);
            return false;
        }

        let isExist = await FindInUser.isExist(userId);

        if (!isExist) {
            Json.builder(Response.HTTP_USER_NOT_FOUND);
            return false;
        }

        return true;
    },
    validationGroupAndUserAndOwnerUser = async (roomId, userId) => {

        let isErr = await validationGroupAndUser(roomId, userId);

        if (!isErr)
            return false;

        let isOwner = await FindInGroup.isOwner(userId, roomId);

        if (!isOwner) {
            Json.builder(Response.HTTP_FORBIDDEN);
            return false;
        }

        return true;
    },
    validationGroupAndUserAndJoinedInGroup = async (roomId, userId) => {

        let isErr = await validationGroupAndUser(roomId, userId);

        if (!isErr)
            return false;

        let isJoined = await FindInGroup.isJoined(roomId, userId);

        if (isJoined) {
            Json.builder(Response.HTTP_NOT_FOUND);
            return false;
        }

        return true;
    },
    isExistAndIsOwnerOfGroup = async (userIdForAdmin, userId, groupId) => {

        let isExist = await FindInUser.isExist(userIdForAdmin);

        if (!isExist) {
            Json.builder(Response.HTTP_USER_NOT_FOUND);
            return false;
        }

        let isOwner = await FindInGroup.isOwner(userId, groupId);

        if (!isOwner) {
            Json.builder(Response.HTTP_FORBIDDEN);
            return false;
        }

        return true;
    };


exports.create = async (req, res) => {

    multerImage(req, res, async () => {

        let name = req.body?.name;

        if (isUndefined(name))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let file = req.file,
            fileUrl,
            isOwner = 1;

        if (!isUndefined(file))
            fileUrl = await File.validationAndWriteFile({
                size: file.size,
                dataBinary: file.buffer,
                format: getFileFormat(file.originalname)
            }).url;


        let id = await InsertInGroup.group(name.toString().trim(), Generate.makeIdForInviteLink(), getRandomHexColor(), fileUrl);

        if (isUndefined(id))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        await Create.groupContents(id)
            .then(() => AddGroupForeignKey.groupContents(id)
                .then(async () => {
                    await InsertInGroup.admin(userId, id, isOwner);
                    await InsertInGroup.user(userId, id);
                }));

        Json.builder(Response.HTTP_CREATED);

    });

}


exports.uploadFile = async (req, res) => {

    multerFile(req, res, async () => {

        let data = JSON.parse(JSON.stringify(req.body)),
            groupId = data?.groupId,
            receiverId = data?.receiverId;

        if (isUndefined(groupId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        if (!isUndefined(receiverId))
            delete data?.receiverId;

        delete data?.groupId;

        let isErr = await validationGroupAndUserAndJoinedInGroup(groupId, userId);

        if (!isErr)
            return;

        let message = Util.validateMessage(data);

        if (message === (IN_VALID_OBJECT_KEY || IN_VALID_MESSAGE_TYPE))
            return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);

        let file = req.file;

        message['senderId'] = userId;
        if (isUndefined(file))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let {
            url,
            size
        } = await File.validationAndWriteFile({
            size: file.size,
            dataBinary: file.buffer,
            format: getFileFormat(file.originalname)
        });

        message['fileUrl'] = url;
        message['fileSize'] = size;
        message['fileName'] = file.originalname;

        await CommonInsert.message('`' + groupId + 'GroupContents`', message, {
            conversationType: 'Group'
        }).then(result => {
            Json.builder(Response.HTTP_CREATED, {
                insertId: result
            });
        });

    });

}


exports.deleteGroup = async req => {

    let id = req.params?.id;

    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let isErr = await validationGroupAndUserAndOwnerUser(id, userId);

    if (!isErr)
        return;

    await DeleteInGroup.group(id);
    await DeleteInGroup.groupAdmins(id);
    await DeleteInGroup.groupUsers(id);
    await DeleteInUser.groupInListOfUserGroups(id);

}


exports.changeName = async req => {

    let bodyObject = req.body,
        name = bodyObject?.name,
        id = bodyObject?.id;

    if (isUndefined(name) || isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let isErr = await validationGroupAndUserAndOwnerUser(id, userId);

    if (!isErr)
        return;

    let result = await UpdateInGroup.name(id, name.toString().trim());

    if (!result)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    Json.builder(Response.HTTP_OK);

}


exports.changeDescription = async req => {

    let bodyObject = req.body,
        id = bodyObject?.id,
        description = bodyObject?.description;

    if (isUndefined(id) || isUndefined(description))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let isErr = await validationGroupAndUserAndOwnerUser(id, userId);

    if (!isErr)
        return;

    let result = await UpdateInGroup.description(id, description);

    if (!result)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    Json.builder(Response.HTTP_OK);

}

exports.uploadAvatar = async (req, res) => {

    multerImage(req, res, async () => {

        let id = req.body?.id;

        if (isUndefined(id))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isErr = await validationGroupAndUserAndOwnerUser(id, userId);

        if (!isErr)
            return;

        let file = req.file;

        if (isUndefined(file))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let {
            url
        } = await File.validationAndWriteFile({
            size: file.size,
            dataBinary: file.buffer,
            format: getFileFormat(file.originalname)
        });

        let result = await UpdateInGroup.img(id, url);

        if (!result)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Json.builder(Response.HTTP_CREATED);

    });

}


exports.changeToInviteLink = async req => {

    let id = req.body?.id;

    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let isErr = await validationGroupAndUserAndOwnerUser(id, userId);

    if (!isErr)
        return;

    let link = Generate.makeIdForInviteLink();

    let result = await UpdateInGroup.inviteLink(id, link);

    if (!result)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    Json.builder(Response.HTTP_OK, {
        inviteLink: link
    });

}

exports.changeToPublicLink = async req => {

    let bodyObject = req.body,
        id = bodyObject?.id,
        publicLink = bodyObject?.publicLink;

    if (isUndefined(id) || isUndefined(publicLink))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let isErr = await validationGroupAndUserAndOwnerUser(id, userId);

    if (!isErr)
        return;

    let realPublicLink = Generate.makeIdForPublicLink(publicLink);

    let isPublicKeyUsed = await FindInGroup.isPublicKeyUsed(realPublicLink);

    if (!isPublicKeyUsed)
        return Json.builder(Response.HTTP_CONFLICT);

    let result = await UpdateInGroup.publicLink(id, realPublicLink);

    if (!result)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    Json.builder(Response.HTTP_OK);

}


exports.joinUser = async req => {

    let bodyObject = req.body,
        id = bodyObject?.id,
        targetUserId = bodyObject?.userId;

    if (isUndefined(id) || isUndefined(targetUserId))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let isErr = await validationGroupAndUserAndOwnerUser(id, userId);

    if (!isErr)
        return;

    let getUserId = isUndefined(targetUserId) ? userId : targetUserId;

    await InsertInGroup.user(id, getUserId);
    await InsertInUser.groupIntoListOfUserGroups(id, getUserId);

    Json.builder(Response.HTTP_CREATED);

}


exports.addAdmin = async req => {

    let bodyObject = req.body,
        id = bodyObject?.id,
        userIdForNewAdmin = bodyObject?.userId;

    if (isUndefined(userIdForNewAdmin) || isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let isErr = await validationGroupAndUser(id, userId);

    if (!isErr)
        return;

    let isErrAgain = await isExistAndIsOwnerOfGroup(userIdForNewAdmin, userId, id);

    if (!isErrAgain)
        return;

    let isJoined = await FindInGroup.isJoined(id, userIdForNewAdmin);

    if (!isJoined)
        return Json.builder(Response.HTTP_NOT_FOUND);

    let isAdmin = await FindInGroup.isAdmin(id, userIdForNewAdmin);

    if (isAdmin)
        return Json.builder(Response.HTTP_CONFLICT);

    let isNotOwner = 0;
    await InsertInGroup.admin(userIdForNewAdmin, id, isNotOwner);

    Json.builder(Response.HTTP_CREATED);

}

exports.deleteAdmin = async req => {

    let bodyObject = req.body,
        id = bodyObject?.id,
        userIdForDeleteAdmin = bodyObject?.userId;

    if (isUndefined(id) || isUndefined(userIdForDeleteAdmin))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let isErr = await validationGroupAndUser(id, userId);

    if (!isErr)
        return;

    let isErrAgain = await isExistAndIsOwnerOfGroup(userIdForDeleteAdmin, userId, id);

    if (!isErrAgain)
        return;

    let isAdmin = await FindInGroup.isAdmin(id, userIdForDeleteAdmin);

    if (!isAdmin)
        return Json.builder(Response.HTTP_NOT_FOUND);

    await DeleteInGroup.admin(id, userIdForDeleteAdmin);

    Json.builder(Response.HTTP_OK);

}


exports.leaveUser = async req => {

    let id = req.body?.id;

    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let isErr = await validationGroupAndUserAndJoinedInGroup(id, userId);

    if (!isErr)
        return;

    await DeleteInGroup.user(id, userId);
    await DeleteInUser.groupIntoListOfUserGroups(id, userId);

    Json.builder(Response.HTTP_OK);

}


exports.listOfMessage = async req => {

    let queryObject = req.query,
        limit = queryObject?.limit,
        page = queryObject?.page,
        id = queryObject?.id,
        order = queryObject?.order,
        sort = queryObject?.sort,
        type = queryObject?.type,
        search = queryObject?.search,
        getLimit = !isUndefined(limit) ? limit : 1,
        getSort = !isUndefined(sort) ? sort : 'DESC',
        getOrder = !isUndefined(order) ? order : 'id',
        getPage = !isUndefined(page) ? page : 1,
        startFrom = (getPage - 1) * limit;

    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let result = await FindInUser.getTableNameForListOfUserGroups(id, userId);

    if (!result)
        return Json.builder(Response.HTTP_USER_NOT_FOUND);


    let count = await FindInGroup.getCountOfListMessage(id);

    let totalPages = Math.ceil(count / getLimit);

    let listOfMessage = await FindInUser.getListOfMessage({
        type: type,
        sort: getSort,
        search: search,
        limit: getLimit,
        order: getOrder,
        startFrom: startFrom,
        tableName: '`' + id + 'GroupContents`'
    });

    Json.builder(
        Response.HTTP_OK,
        listOfMessage, {
            totalPages: totalPages
        }
    );

}


exports.info = async req => {

    let id = req.body?.id;

    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let isDefined = await FindInGroup.id(id);

    if (!isDefined)
        return Json.builder(Response.HTTP_NOT_FOUND);

    let info = await FindInGroup.getInfo(id);

    let countOfUser = await FindInGroup.getCountOfUsers(id);

    Json.builder(Response.HTTP_OK, info, {
        memberSize: countOfUser
    });

}


exports.allUsers = async req => {

    let id = req.body?.id;

    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    let isDefined = await FindInGroup.id(id);

    if (!isDefined)
        return Json.builder(Response.HTTP_NOT_FOUND);

    let users = await FindInGroup.getAllUsers(id);

    if (isUndefined(users))
        return Json.builder(Response.HTTP_NOT_FOUND);

    let result = await FindInUser.getUserDetailsInUsersTableForMember(users);

    Json.builder(Response.HTTP_OK, result);

}