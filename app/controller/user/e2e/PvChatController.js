let Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    Create = require('app/model/create/users'),
    AddUserForeignKey = require('app/model/add/foreignKey/users'),
    Find = require('app/model/find/user/users'),
    multer = require('multer'),
    Insert = require('app/model/add/insert/user/users'),
    Delete = require('app/model/remove/users/user'),
    CommonInsert = require('app/model/add/insert/common/index'),
    Util, {
        isUndefined,
        getFileFormat,
        IN_VALID_MESSAGE_TYPE,
        IN_VALID_OBJECT_KEY
    } = require('app/util/Util'),
    File = require('app/util/File'),
    multerFile = multer().single('file'),
    {
        getTokenPayLoad
    } = require('app/middleware/RouterUtil');


let validationE2E = (id, from, cb) => {

    Find.isExist(id, isUserInDb => {
        if (!isUserInDb)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        Find.getTableNameForListOfE2EMessage(from, id, data => {
            if (!data)
                return Json.builder(Response.HTTP_NOT_FOUND);

            cb(data);
        });

    });

}


exports.createE2EChat = (req) => {

    let userId = Number(req.body?.userId),
        isNumber = Number.isInteger(userId);


    if (!isNumber)
        return Json.builder(Response.HTTP_BAD_REQUEST);


    Find.isExist(userId, isInDb => {

        if (!isInDb)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);


        getTokenPayLoad(data => {

            let tokenUserId = data.id;

            Create.e2eContents(tokenUserId, userId, result => {


                if (!result)
                    return Json.builder(Response.HTTP_CONFLICT);


                AddUserForeignKey.e2eContents(tokenUserId, userId);

                Json.builder(Response.HTTP_CREATED);


                let tableName = tokenUserId + 'And' + userId + 'E2EContents';

                Insert.chatIdInListOfUserE2Es(tokenUserId, userId, tokenUserId, tableName);
                Insert.chatIdInListOfUserE2Es(userId, tokenUserId, userId, tableName);


            });

        });

    });

};


exports.uploadFile = (req, res) => {


    getTokenPayLoad(data => {

        let userId = data.id;

        Find.isExist(userId, isInDb => {

            if (!isInDb)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);


            multerFile(req, res, () => {

                let data = JSON.parse(JSON.stringify(req.body));
                let receiverId = data?.receiverId;

                if (isUndefined(receiverId))
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                delete data?.receiverId;

                Find.isExist(receiverId, isInDb => {

                    if (!isInDb)
                        return Json.builder(Response.HTTP_USER_NOT_FOUND);

                    Find.isExistChatRoom({
                        toUser: `${receiverId}`,
                        fromUser: `${userId}`
                    }, result => {

                        if (!result)
                            return Json.builder(Response.HTTP_NOT_FOUND);

                        Util.validateMessage(data, result => {

                            if (result === (IN_VALID_OBJECT_KEY || IN_VALID_MESSAGE_TYPE))
                                return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);

                            let toUser = receiverId;
                            let fromUser = data?.senderId;

                            if (isUndefined(toUser) || isUndefined(fromUser))
                                return Json.builder(Response.HTTP_BAD_REQUEST);

                            let file = req.file;

                            if (isUndefined(file))
                                return Json.builder(Response.HTTP_BAD_REQUEST);

                            let {
                                fileUrl,
                                fileSize
                            } = File.validationAndWriteFile(file.buffer, getFileFormat(file.originalname));

                            data['fileUrl'] = fileUrl;
                            data['fileSize'] = fileSize;
                            data['fileName'] = file.originalname;


                            CommonInsert.message(fromUser + 'And' + toUser + 'E2EContents', data, {
                                conversationType: 'E2E'
                            }, result => {
                                Json.builder(Response.HTTP_CREATED, {
                                    insertId: result
                                });
                            });

                        });

                    });

                });

            });

        });

    });


};


exports.listOfMessage = (req) => {
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

    getTokenPayLoad(data => {

        let from = data.id;

        Find.getTableNameForListOfE2EMessage(from, to, data => {

            if (!data)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);


            Find.getCountOfListMessage(data, count => {

                let totalPages = Math.ceil(count / getLimit);

                Find.getListOfMessage(data, startFrom, getLimit, getOrder, getSort, type, search, result => {

                    Json.builder(
                        Response.HTTP_OK,
                        result, {
                            totalPages: totalPages
                        }
                    );

                });

            });

        });


    });


}


exports.user = (req) => {

    let id = req.query?.id;

    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);


    Find.isExist(id, isUserInDb => {
        if (!isUserInDb)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        Find.getUserPvDetails(id, result => {
            Json.builder(Response.HTTP_OK, result);
        });

    });


}

exports.deleteForMe = (req) => {

    let id = req.params?.id;

    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {

        let from = data.id;

        validationE2E(id, from, () => {

            Delete.chatInListOfChatsForUser(from, id, from);

            Json.builder(Response.HTTP_OK);
        });

    });

}

exports.deleteForUs = (req) => {


    let id = req.params?.id;


    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);


    getTokenPayLoad(data => {

        let from = data.id;

        validationE2E(id, from, data => {

            Delete.chat(data, () => {

                Delete.chatInListOfChatsForUser(from, id, from);
                Delete.chatInListOfChatsForUser(from, id, id);
                Json.builder(Response.HTTP_OK);

            });

        });

    });


}


exports.blockUser = (req) => {


    let id = req.body?.id;


    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);


    getTokenPayLoad(data => {

        let from = data.id;

        Find.isExist(id, isUserInDb => {
            if (!isUserInDb)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);

            Find.isBlock(from, id, result => {
                if (!result) {
                    Insert.addUserToUsersBlockList(from, id);
                    return Json.builder(Response.HTTP_OK);
                }

                Delete.removeUserInUsersBlockList(from, id);
                Json.builder(Response.HTTP_OK);
            });

        });

    });

}