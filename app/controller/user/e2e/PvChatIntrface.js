let Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    Create = require('app/model/create/users'),
    Add = require('app/model/add/foreignKey/users'),
    Find = require('app/model/find/user/users'),
    PipeLine = require('app/middleware/ApiPipeline'),
    multer = require('multer'),
    Insert = require('app/model/add/insert/user/users'),
    Util = require('app/util/Util'),
    File = require('app/util/File'),
    multerFile = multer().single('file');




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

        let file = req.file;

        if (file !== undefined) {

            File.decodeAndWriteFile(file.buffer, Util.getFileFormat(file.originalname));


        }

    });

};