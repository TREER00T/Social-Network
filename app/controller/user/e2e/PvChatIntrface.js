let Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    Create = require('app/model/create/users'),
    Add = require('app/model/add/foreignKey/users'),
    Find = require('app/model/find/user/users'),
    PipeLine = require('app/middleware/ApiPipeline'),
    multer = require('multer'),
    Insert = require('app/model/add/insert/user/users'),
    CommonInsert = require('app/model/add/insert/common/index'),
    Util = require('app/util/Util'),
    File = require('app/util/File'),
    multerFile = multer().single('file'),
    RestFulUtil = require('app/util/Util'),
    {
        getAccessTokenPayLoad
    } = require('app/middleware/ApiPipeline');


exports.createE2EChat = (req, res) => {

    Json.initializationRes(res);

    let userId = Number(req.body.userId);
    let isNumber = Number.isInteger(userId);


    if (!isNumber)
        return Json.builder(Response.HTTP_BAD_REQUEST);


    Find.isExistUser(userId, isInDb => {

        if (!isInDb)
            return Json.builder(Response.HTTP_User_NOT_FOUND);


        let phone = PipeLine.token.at.phoneNumber;


        Create.e2eContents(phone, userId, result => {


            if (!result)
                return Json.builder(Response.HTTP_CONFLICT);


            Add.e2eContents(phone, userId);

            Json.builder(Response.HTTP_CREATED);


            let tableName = phone + 'And' + userId + 'E2EContents';

            Insert.chatIdInListOfUserE2Es(phone, userId, tableName);


        });


    });

};


exports.uploadFile = (req, res) => {


    Json.initializationRes(res);


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


exports.listOfMessage = (req, res) => {


    Json.initializationRes(res);


    let {to, limit, page, order, sort, type} = req.query;

    let getLimit = (limit !== undefined) ? limit : 15;
    let getSort = (sort !== undefined) ? sort : 'DESC';
    let getOrder = (order !== undefined) ? order : 'id';

    let startFrom = (page - 1) * limit;

    getAccessTokenPayLoad(data => {

        let from = data.userId;

        Find.getTableNameForListOfE2EMessage(from, to, data => {

            if (!data)
                return Json.builder(Response.HTTP_User_NOT_FOUND);


            Find.getCountOfListMessage(data, count => {

                let totalPages = Math.ceil(count / getLimit);

                Find.getListOfMessage(data, startFrom, getLimit, getOrder, getSort, type, result => {

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


exports.user = (req, res) => {


    Json.initializationRes(res);

    let id = req.query;

    Find.isExistUser(id, isUserInDb => {
        if (!isUserInDb)
            return Json.builder(Response.HTTP_User_NOT_FOUND);

        Find.getUserPvDetails(id, result => {
            return Json.builder(Response.HTTP_OK, result);
        });
    });


}