let Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    Create = require('app/model/create/users'),
    Add = require('app/model/add/foreignKey/users'),
    Find = require('app/model/find/user/users'),
    PipeLine = require('app/middleware/ApiPipeline');


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

            // insert room in list user room
        });


    });

};


var multer = require('multer');
var upload = multer({dest: 'uploads/'}).single("png");
var a = multer({dest: 'uploads/'}).single("a");

exports.uploadFile = (req, res) => {


    Json.initializationRes(res);

    a(req, res, (err) => {
      //  console.log(req.key.a)
    });
    upload(req, res, (err) => {

    });
};