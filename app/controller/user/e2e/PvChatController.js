let Json = require('../../../util/ReturnJson'),
    Response = require('../../../util/Response'),
    Create = require('../../../model/create/users'),
    AddUserForeignKey = require('../../../model/add/foreignKey/users'),
    Find = require('../../../model/find/user/users'),
    multer = require('multer'),
    Insert = require('../../../model/add/insert/user/users'),
    Delete = require('../../../model/remove/users/user'),
    CommonInsert = require('../../../model/add/insert/common/index'),
    Util, {
        isUndefined,
        getFileFormat,
        IN_VALID_MESSAGE_TYPE,
        IN_VALID_OBJECT_KEY
    } = require('../../../util/Util'),
    File = require('../../../util/File'),
    multerFile = multer().single('file'),
    {
        getTokenPayLoad
    } = require('../../../middleware/RouterUtil');


let validationE2E = async (id, from) => {

    let isUserInDb = await Find.isExist(id);

    if (!isUserInDb) {
        Json.builder(Response.HTTP_USER_NOT_FOUND);
        return false;
    }

    let result = await Find.getTableNameForListOfE2EMessage(from, id);

    if (!result) {
        Json.builder(Response.HTTP_NOT_FOUND);
        return false;
    }

    return result;
}

module.exports = class {

    from;

    async init() {
        let tokenPayload = await getTokenPayLoad();
        this.from = tokenPayload.id;
    }

    async createE2EChat(req) {

        let userId = Number(req.body?.userId),
            isNumber = Number.isInteger(userId);

        if (!isNumber)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isInDb = await Find.isExist(userId);

        if (!isInDb)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        let tokenUserId = userId;

        let result = await Create.e2eContents(tokenUserId, userId);

        if (!result)
            return Json.builder(Response.HTTP_CONFLICT);

        await AddUserForeignKey.e2eContents(tokenUserId, userId);

        Json.builder(Response.HTTP_CREATED);

        let tableName = tokenUserId + 'And' + userId + 'E2EContents';

        await Insert.chatIdInListOfUserE2Es(tokenUserId, userId, tokenUserId, tableName);
        await Insert.chatIdInListOfUserE2Es(userId, tokenUserId, userId, tableName);

    }

    async uploadFile(req, res) {

        this.init();

        let userId = this.from;

        let isInDb = await Find.isExist(userId);

        if (!isInDb)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        multerFile(req, res, async () => {

            let data = JSON.parse(JSON.stringify(req.body));
            let receiverId = data?.receiverId;

            if (isUndefined(receiverId))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            delete data?.receiverId;

            let isInDb = await Find.isExist(receiverId);

            if (!isInDb)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);

            let isExistChatRoom = await Find.isExistChatRoom({
                toUser: `${receiverId}`,
                fromUser: `${userId}`
            });

            if (!isExistChatRoom)
                return Json.builder(Response.HTTP_NOT_FOUND);

            let message = Util.validateMessage(data);

            if (message === (IN_VALID_OBJECT_KEY || IN_VALID_MESSAGE_TYPE))
                return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);

            let toUser = receiverId;
            let fromUser = data?.senderId;

            if (isUndefined(toUser) || isUndefined(fromUser))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            let file = req.file;

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

            await CommonInsert.message(fromUser + 'And' + toUser + 'E2EContents', message, {
                conversationType: 'E2E'
            }).then(result => {
                Json.builder(Response.HTTP_CREATED, {
                    insertId: result
                });
            });

        });

    }

    async listOfMessage(req) {

        this.init();

        let queryObject = req.query,
            limit = queryObject?.limit,
            page = queryObject?.page,
            order = queryObject?.order,
            to = queryObject?.to,
            sort = queryObject?.sort,
            type = queryObject?.type,
            search = queryObject?.search,
            getLimit = !isUndefined(limit) ? limit : 1,
            getSort = !isUndefined(sort) ? sort : 'DESC',
            getOrder = !isUndefined(order) ? order : 'id',
            getPage = !isUndefined(page) ? page : 1,
            startFrom = (getPage - 1) * limit;

        if (isUndefined(to))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let result = await Find.getTableNameForListOfE2EMessage(this.from, to);

        if (!result)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        let count = await Find.getCountOfListMessage(result);

        let totalPages = Math.ceil(count / getLimit);

        let listOfMessage = await Find.getListOfMessage({
            type: type,
            sort: getSort,
            search: search,
            limit: getLimit,
            order: getOrder,
            startFrom: startFrom,
            tableName: result
        });

        Json.builder(
            Response.HTTP_OK,
            listOfMessage, {
                totalPages: totalPages
            }
        );

    }

    async user(req) {

        let id = req.query?.id;

        if (isUndefined(id))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isUserInDb = await Find.isExist(id);

        if (!isUserInDb)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        let userPvDetails = await Find.getUserPvDetails(id);

        Json.builder(Response.HTTP_OK, userPvDetails);

    }

    async deleteForMe(req) {

        this.init();

        let id = req.params?.id;

        if (isUndefined(id))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isErr = await validationE2E(id, this.from);

        if (!isErr)
            return;

        await Delete.chatInListOfChatsForUser(this.from, id, this.from);

        Json.builder(Response.HTTP_OK);

    }

    async deleteForUs(req) {

        this.init();

        let id = req.params?.id;

        if (isUndefined(id))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let nameOfE2ERoom = await validationE2E(id, this.from);

        if (nameOfE2ERoom === false)
            return;

        await Delete.chat(nameOfE2ERoom);

        await Delete.chatInListOfChatsForUser(this.from, id, this.from);
        await Delete.chatInListOfChatsForUser(this.from, id, id);
        Json.builder(Response.HTTP_OK);

    }

    async blockUser(req) {

        this.init();

        let id = req.body?.id;

        if (isUndefined(id))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isUserInDb = await Find.isExist(id);

        if (!isUserInDb)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        let isBlock = await Find.isBlock(this.from, id);

        if (!isBlock) {
            await Insert.addUserToUsersBlockList(this.from, id);
            return Json.builder(Response.HTTP_OK);
        }

        await Delete.removeUserInUsersBlockList(this.from, id);
        Json.builder(Response.HTTP_OK);

    }

}