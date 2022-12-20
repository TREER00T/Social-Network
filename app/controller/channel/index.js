let Json = require('../../util/ReturnJson'),
    Response = require('../../util/Response'),
    multer = require('multer'),
    Insert = require('../../model/add/channel'),
    InsertInUser = require('../../model/add/user'),
    Create = require('../../model/create/channel'),
    FindInChannel = require('../../model/find/channel'),
    FindInUser = require('../../model/find/user'),
    CommonInsert = require('../../model/add/common'),
    DeleteInChannel = require('../../model/remove/channel'),
    UpdateInChannel = require('../../model/update/channel'),
    DeleteInUser = require('../../model/remove/user'),
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


let validationChannelAndUser = async (roomId, userId) => {

        let isIdDefined = FindInChannel.id(roomId);

        if (!isIdDefined) {
            Json.builder(Response.HTTP_NOT_FOUND);
            return false;
        }

        let isExistUser = await FindInUser.isExist(userId);

        if (!isExistUser) {
            Json.builder(Response.HTTP_USER_NOT_FOUND)
            return false;
        }

        return true;
    },
    validationChannelAndUserAndOwnerUser = async (roomId, userId) => {

        let isErr = await validationChannelAndUser(roomId, userId);

        if (!isErr)
            return false;

        let isOwner = await FindInChannel.isOwner(userId, roomId);

        if (!isOwner) {
            Json.builder(Response.HTTP_FORBIDDEN);
            return false;
        }

        return true;
    },
    validationChannelAndUserAndOwnerOrAdmin = async (roomId, userId) => {

        let isErr = await validationChannelAndUser(roomId, userId);

        if (!isErr)
            return false;

        let isOwnerOrAdmin = await FindInChannel.isOwnerOrAdmin(userId, roomId);

        if (!isOwnerOrAdmin) {
            Json.builder(Response.HTTP_FORBIDDEN);
            return false;
        }

        return true;
    },
    validationChannelAndUserAndJoinedInChannel = async (roomId, userId) => {

        let isErr = await validationChannelAndUser(roomId, userId);

        if (!isErr)
            return false;

        let isJoined = await FindInChannel.isJoined(roomId, userId);

        if (isJoined) {
            Json.builder(Response.HTTP_NOT_FOUND);
            return false;
        }

        return true;
    },
    isExistUserAndIsOwner = async (userIdForAdmin, userId, channelId) => {

        let isExist = await FindInUser.isExist(userIdForAdmin);

        if (!isExist) {
            Json.builder(Response.HTTP_USER_NOT_FOUND);
            return false;
        }

        let isOwner = await FindInChannel.isOwner(userId, channelId);

        if (!isOwner) {
            Json.builder(Response.HTTP_FORBIDDEN);
            return false;
        }

        return true;
    };

module.exports = class {

    userId;

    async init() {
        let tokenPayload = await getTokenPayLoad();
        this.userId = tokenPayload.id;
    }

    async create(req, res) {

        this.init();

        multerImage(req, res, async () => {

            let file = req.file,
                fileUrl,
                isOwner = 1,
                name = req.body?.name;

            if (isUndefined(name))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            if (!isUndefined(file))
                fileUrl = await File.validationAndWriteFile({
                    size: file.size,
                    dataBinary: file.buffer,
                    format: getFileFormat(file.originalname)
                }).url;


            let id = await Insert.channel(name.toString().trim(), Generate.makeIdForInviteLink(), getRandomHexColor(), fileUrl)

            if (isUndefined(id))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            await Create.channelContent(id)
                    .then(async () => {
                        await Insert.admin(this.userId, id, isOwner);
                        await Insert.user(this.userId, id);
                    });

            Json.builder(Response.HTTP_CREATED);

        });

    }

    async deleteChannel(req) {

        this.init();

        let id = req.params?.id;

        if (isUndefined(id))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isErr = await validationChannelAndUserAndOwnerUser(id, this.userId);

        if (!isErr)
            return;

        await DeleteInChannel.channel(id);
        await DeleteInChannel.admins(id);
        await DeleteInChannel.users(id);
        await DeleteInUser.channelInListOfUserChannel(id);

        Json.builder(Response.HTTP_OK);
    }

    async uploadFile(req, res) {

        this.init();

        multerFile(req, res, async () => {

            let data = JSON.parse(JSON.stringify(req.body)),
                receiverId = data?.receiverId,
                channelId = data?.channelId;

            if (isUndefined(channelId))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            if (!isUndefined(receiverId))
                delete data?.receiverId;

            delete data?.channelId;

            let isErr = await validationChannelAndUserAndOwnerOrAdmin(channelId, this.userId);

            if (!isErr)
                return;

            let isJoined = await FindInChannel.isJoined(channelId, this.userId);

            if (!isJoined)
                return Json.builder(Response.HTTP_NOT_FOUND);


            let message = Util.validateMessage(data);

            if (message === (IN_VALID_OBJECT_KEY || IN_VALID_MESSAGE_TYPE))
                return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);


            message.senderId = this.userId;
            let file = req.file;

            if (!isUndefined(file))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            let {
                url,
                size
            } = await File.validationAndWriteFile({
                size: file.size,
                dataBinary: file.buffer,
                format: getFileFormat(file.originalname)
            });

            message.fileUrl = url;
            message.fileSize = size;
            message.fileName = file.originalname;


            await CommonInsert.message(`${channelId}ChannelContents`, message, {
                conversationType: 'Channel'
            }).then(result => {
                Json.builder(Response.HTTP_CREATED, {
                    insertId: result
                });
            });

        });

    }

    async changeName(req) {

        this.init();

        let bodyObject = req.body,
            name = bodyObject?.body,
            id = bodyObject?.body;

        if (isUndefined(name) || isUndefined(id))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isErr = await validationChannelAndUserAndOwnerUser(id, this.userId);

        if (!isErr)
            return;

        let result = await UpdateInChannel.name(id, name.toString().trim());

        if (!result)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Json.builder(Response.HTTP_OK);

    }

    async changeDescription(req) {

        this.init();

        let bodyObject = req.body,
            id = bodyObject?.id,
            description = bodyObject?.description;


        if (isUndefined(id) || isUndefined(description))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isErr = await validationChannelAndUserAndOwnerUser(id, this.userId);

        if (!isErr)
            return;

        let result = await UpdateInChannel.description(id, description);

        if (!result)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Json.builder(Response.HTTP_OK);

    }

    async uploadAvatar(req, res) {

        this.init();

        multerImage(req, res, async () => {

            let id = req.body?.id;

            if (isUndefined(id))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            let isErr = await validationChannelAndUserAndOwnerUser(id, this.userId);

            if (!isErr)
                return;

            let file = req.file;

            if (!isUndefined(file))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            let {
                url
            } = await File.validationAndWriteFile({
                size: file.size,
                dataBinary: file.buffer,
                format: getFileFormat(file.originalname)
            });

            let result = await UpdateInChannel.img(id, url);

            if (!result)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            Json.builder(Response.HTTP_CREATED);

        });

    }

    async changeToInviteLink(req) {

        this.init();

        let id = req.body?.id;

        if (isUndefined(id))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isErr = await validationChannelAndUserAndOwnerUser(id, this.userId);

        if (!isErr)
            return;

        let link = Generate.makeIdForInviteLink();

        let result = await UpdateInChannel.inviteLink(id, link);

        if (!result)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Json.builder(Response.HTTP_OK, {
            inviteLink: link
        });

    }

    async changeToPublicLink(req) {

        this.init();

        let bodyObject = req.body,
            id = bodyObject?.id,
            publicLink = bodyObject?.publicLink;

        if (isUndefined(id) || isUndefined(publicLink))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isErr = await validationChannelAndUserAndOwnerUser(id, this.userId);

        if (!isErr)
            return;

        let realPublicLink = Generate.makeIdForPublicLink(publicLink);

        let isPublicKeyUsed = await FindInChannel.isPublicKeyUsed(realPublicLink);

        if (!isPublicKeyUsed)
            return Json.builder(Response.HTTP_CONFLICT);

        let result = await UpdateInChannel.publicLink(id, publicLink);

        if (!result)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        Json.builder(Response.HTTP_OK);

    }

    async joinUser(req) {

        this.init();

        let bodyObject = req.body,
            id = bodyObject?.id,
            targetUserId = bodyObject?.userId;

        if (isUndefined(id) || isUndefined(targetUserId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isErr = await validationChannelAndUserAndJoinedInChannel(id, this.userId);

        if (!isErr)
            return;

        let getUserId = isUndefined(targetUserId) ? this.userId : targetUserId;

        await Insert.user(id, getUserId);
        await InsertInUser.channelIntoListOfUserChannels(id, getUserId);

        Json.builder(Response.HTTP_CREATED);

    }

    async addAdmin(req) {

        this.init();

        let bodyObject = req.body,
            id = bodyObject?.id,
            userIdForNewAdmin = bodyObject?.userId;

        if (isUndefined(id) || isUndefined(userIdForNewAdmin))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isErr = await validationChannelAndUser(id, this.userId);

        if (!isErr)
            return;

        let isErrAgain = await isExistUserAndIsOwner(userIdForNewAdmin, this.userId, id);

        if (!isErrAgain)
            return;

        let isJoined = await FindInChannel.isJoined(id, userIdForNewAdmin);

        if (!isJoined)
            return Json.builder(Response.HTTP_NOT_FOUND);

        let isAdmin = await FindInChannel.isAdmin(id, userIdForNewAdmin);

        if (isAdmin)
            return Json.builder(Response.HTTP_CONFLICT);

        let isNotOwner = 0;
        await Insert.admin(userIdForNewAdmin, id, isNotOwner);


        Json.builder(Response.HTTP_CREATED);

    }

    async deleteAdmin(req) {

        this.init();

        let bodyObject = req.body,
            id = bodyObject?.id,
            userIdForDeleteAdmin = bodyObject?.userId;

        if (isUndefined(id) || isUndefined(userIdForDeleteAdmin))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isErr = await validationChannelAndUser(id, this.userId);

        if (!isErr)
            return;

        let isErrAgain = await isExistUserAndIsOwner(userIdForDeleteAdmin, this.userId, id);

        if (!isErrAgain)
            return;

        let isAdmin = await FindInChannel.isAdmin(id, userIdForDeleteAdmin);

        if (!isAdmin)
            return Json.builder(Response.HTTP_NOT_FOUND);

        await DeleteInChannel.admin(id, userIdForDeleteAdmin);

        Json.builder(Response.HTTP_OK);

    }

    async leaveUser(req) {

        this.init();

        let id = req.body?.id;

        if (isUndefined(id))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isErr = await validationChannelAndUserAndJoinedInChannel(id, this.userId);

        if (!isErr)
            return;

        await DeleteInChannel.user(id, this.userId);
        await DeleteInUser.channelIntoListOfUserChannel(id, this.userId);

        Json.builder(Response.HTTP_OK);

    }

    async listOfMessage(req) {

        this.init();

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

        let result = await FindInUser.getTableNameForListOfUserChannels(id, this.userId);

        if (!result)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        let count = await FindInChannel.getCountOfListMessage(id);

        let totalPages = Math.ceil(count / getLimit);

        let listOfMessage = await FindInUser.getListOfMessage({
            type: type,
            sort: getSort,
            search: search,
            limit: getLimit,
            order: getOrder,
            startFrom: startFrom,
            tableName: '`' + id + 'ChannelContents`'
        });

        Json.builder(
            Response.HTTP_OK,
            listOfMessage, {
                totalPages: totalPages
            }
        );

    }

    async info(req) {

        this.init();

        let id = req.body?.id;

        if (isUndefined(id))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isDefined = await FindInChannel.id(id);

        if (!isDefined)
            return Json.builder(Response.HTTP_NOT_FOUND);

        let info = await FindInChannel.getInfo(id);

        let countOfUser = await FindInChannel.getCountOfUsers(id);

        Json.builder(Response.HTTP_OK, info, {
            memberSize: countOfUser
        });

    }

    async allUsers(req) {

        this.init();

        let id = req.body?.id;

        if (isUndefined(id))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isErr = await validationChannelAndUserAndOwnerOrAdmin(id, this.userId);

        if (!isErr)
            return;

        let users = await FindInChannel.getAllUsers(id);

        if (isUndefined(users))
            return Json.builder(Response.HTTP_NOT_FOUND);

        let result = await FindInUser.getUserDetailsInUsersTableForMember(users);

        Json.builder(Response.HTTP_OK, result);

    }

}