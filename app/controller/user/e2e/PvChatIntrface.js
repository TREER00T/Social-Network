let Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    Create = require('app/model/create/users'),
    AddUserForeignKey = require('app/model/add/foreignKey/users'),
    Find = require('app/model/find/user/users'),
    multer = require('multer'),
    Insert = require('app/model/add/insert/user/users'),
    Delete = require('app/model/remove/users/user'),
    CommonInsert = require('app/model/add/insert/common/index'),
    Util = require('app/util/Util'),
    File = require('app/util/File'),
    multerFile = multer().single('file'),
    RestFulUtil = require('app/util/Util'),
    {
        getAccessTokenPayLoad
    } = require('app/middleware/ApiPipeline');


exports.createE2EChat = (req) => {

    let userId = Number(req.body.userId);
    let isNumber = Number.isInteger(userId);


    if (!isNumber)
        return Json.builder(Response.HTTP_BAD_REQUEST);


    Find.isExistUser(userId, isInDb => {

        if (!isInDb)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);


        getAccessTokenPayLoad(data => {

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


    multerFile(req, res, () => {

        let data = JSON.parse(JSON.stringify(req.body));

        RestFulUtil.validateMessage(data, result => {

            if (result === (RestFulUtil.IN_VALID_OBJECT_KEY || RestFulUtil.IN_VALID_MESSAGE_TYPE))
                return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);

            let toUser = data['receiverId'];
            let fromUser = data['senderId'];
            delete data['receiverId'];

            if (toUser && fromUser !== undefined) {

                let file = req.file;

                if (file !== undefined) {

                    let {
                        fileUrl,
                        fileSize
                    } = File.validationAndWriteFile(file.buffer, Util.getFileFormat(file.originalname));

                    data['fileUrl'] = fileUrl;
                    data['fileSize'] = fileSize;
                    data['fileName'] = file.originalname;


                    CommonInsert.message(fromUser + 'And' + toUser + 'E2EContents', data, result => {

                        return Json.builder(Response.HTTP_OK, {
                            insertId: result
                        });

                    });

                }

                return Json.builder(Response.HTTP_BAD_REQUEST);

            }

            return Json.builder(Response.HTTP_BAD_REQUEST);
        });


    });


};


exports.listOfMessage = (req) => {


    let {to, limit, page, order, sort, type, search} = req.query;

    let getLimit = (limit !== undefined) ? limit : 15;
    let getSort = (sort !== undefined) ? sort : 'DESC';
    let getOrder = (order !== undefined) ? order : 'id';

    let startFrom = (page - 1) * limit;

    getAccessTokenPayLoad(data => {

        let from = data.id;

        Find.getTableNameForListOfE2EMessage(from, to, data => {

            if (!data)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);


            Find.getCountOfListMessage(data, count => {

                let totalPages = Math.ceil(count / getLimit);

                Find.getListOfMessage(data, startFrom, getLimit, getOrder, getSort, type, search, result => {

                    return Json.builder(
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

    let id = req.query.id;

    Find.isExistUser(id, isUserInDb => {
        if (!isUserInDb)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        Find.getUserPvDetails(id, result => {
            return Json.builder(Response.HTTP_OK, result);
        });
    });


}

exports.deleteForMe = (req) => {

    let id = req.params.id;

    getAccessTokenPayLoad(() => {

        let from = data.id;

        Find.isExistUser(id, isUserInDb => {
            if (!isUserInDb)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);

            Find.getTableNameForListOfE2EMessage(from, id, data => {
                if (!data)
                    return Json.builder(Response.HTTP_NOT_FOUND);


                Delete.chatInListOfChatsForUser(from, id, from, result => {
                    return Json.builder(Response.HTTP_OK, result);
                });

            });

        });

    });


}

exports.deleteForUs = (req) => {


    let id = req.params.id;


    getAccessTokenPayLoad(() => {

        let from = data.id;

        Find.isExistUser(id, isUserInDb => {
            if (!isUserInDb)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);

            Find.getTableNameForListOfE2EMessage(from, id, data => {
                if (!data)
                    return Json.builder(Response.HTTP_NOT_FOUND);


                Delete.chat(data, () => {

                    Delete.chatInListOfChatsForUser(from, id, from, () => {

                        Delete.chatInListOfChatsForUser(from, id, id);

                        return Json.builder(Response.HTTP_OK);
                    });

                });

            });

        });

    });


}


exports.blockUser = (req) => {


    let id = req.body.id;


    getAccessTokenPayLoad(() => {

        let from = data.id;

        Find.isExistUser(id, isUserInDb => {
            if (!isUserInDb)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);

            Find.isUserInListOfBlockUser(from, id, result => {
                if (!result) {
                    Insert.addUserToUsersBlockList(from, id);
                    return Json.builder(Response.HTTP_OK);
                }

                Delete.removeUserInUsersBlockList(from, id);
                return Json.builder(Response.HTTP_OK);
            });

        });

    });

}