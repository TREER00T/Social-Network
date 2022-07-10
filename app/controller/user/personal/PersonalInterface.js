let Json = require('app/util/ReturnJson'),
    {
        getAccessTokenPayLoad
    } = require('app/middleware/ApiPipeline'),
    Response = require('app/util/Response'),
    Update = require('app/model/update/user/users'),
    Find = require('app/model/find/user/users'),
    multer = require('multer'),
    {
        NULL
    } = require('opensql').queryHelper,
    multerImage = multer().single('image'),
    {
        getHashData
    } = require('app/util/Generate'),
    File = require('app/util/File'),
    Util = require('app/util/Util');


exports.user = (req, res) => {


    Json.initializationRes(res);


    getAccessTokenPayLoad(data => {

        let userId = data.id;

        Find.getPersonalUserDetails(userId, result => {

            return Json.builder(Response.HTTP_OK, result);
        });


    });


}


exports.editUsername = (req, res) => {

    Json.initializationRes(res);


    let username = req.params.id;

    if (username < 1 || username === undefined)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getAccessTokenPayLoad(data => {

        let phone = data.phoneNumber;

        Find.isUsernameUsed(username.toString().trim(), result => {

            if (result) {
                Update.username(phone, username.toString().trim(), result => {
                    if (!result)
                        return Json.builder(Response.HTTP_BAD_REQUEST);

                    return Json.builder(Response.HTTP_OK);
                });
            }

            return Json.builder(Response.HTTP_CONFLICT);

        });

    });


}


exports.editBio = (req, res) => {

    Json.initializationRes(res);


    let bio = req.params.bio;

    if (bio < 1 || bio === undefined)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getAccessTokenPayLoad(data => {

        let phone = data.phoneNumber;

        Find.isUsernameUsed(bio.toString().trim(), result => {

            if (result) {
                Update.bio(phone, bio.toString().trim(), result => {
                    if (!result)
                        return Json.builder(Response.HTTP_BAD_REQUEST);

                    return Json.builder(Response.HTTP_OK);
                });
            }

            return Json.builder(Response.HTTP_CONFLICT);

        });

    });


}


exports.editName = (req, res) => {

    Json.initializationRes(res);


    let {lastName, firstName} = req.body;

    if (firstName < 1 || firstName === undefined)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getAccessTokenPayLoad(data => {

        let phone = data.phoneNumber;

        Update.name(phone, firstName.toString().trim(), lastName.toString().trim(), result => {
            if (!result)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            return Json.builder(Response.HTTP_OK);
        });


    });


}


exports.twoAuth = (req, res) => {


    Json.initializationRes(res);

    let {password, email} = req.body;

    if (email === undefined && (password === undefined || password < 6))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getAccessTokenPayLoad(data => {

        let phone = data.phoneNumber;


        Update.passwordAndEmail(phone, getHashData(password, phone), email, result => {
            if (!result)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            return Json.builder(Response.HTTP_OK);
        });

    });

}


exports.disableTwoAuth = (req, res) => {

    Json.initializationRes(res);


    getAccessTokenPayLoad(data => {

        let phone = data.phoneNumber;

        Update.passwordAndEmail(phone, NULL, NULL, result => {
            if (!result)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            return Json.builder(Response.HTTP_OK);
        });

    });

}


exports.restPassword = (req, res) => {


    Json.initializationRes(res);

    let oldPassword = req.body.old;
    let newPassword = req.body.new;


    if (oldPassword === undefined && newPassword === undefined)
        return Json.builder(Response.HTTP_BAD_REQUEST);


    getAccessTokenPayLoad(data => {

        let phone = data.phoneNumber;

        Find.isValidPassword(phone, getHashData(oldPassword, phone), result => {

            if (!result)
                return Json.builder(Response.HTTP_FORBIDDEN);

            Update.password(phone, getHashData(newPassword, phone), result => {
                if (!result)
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                return Json.builder(Response.HTTP_OK);
            });

        });

    });

}


exports.uploadAvatar = (req, res) => {


    Json.initializationRes(res);


    getAccessTokenPayLoad(data => {

        let phone = data.phoneNumber;


        multerImage(req, res, () => {


            let file = req.image;

            if (file === undefined)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            let {
                fileUrl
            } = File.validationAndWriteFile(file.buffer, Util.getFileFormat(file.originalname));

            Update.img(phone, fileUrl, result => {
                if (!result)
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                return Json.builder(Response.HTTP_OK);
            });

        });

    });

}


exports.listOfBlockUsers = (req, res) => {

    Json.initializationRes(res);


    getAccessTokenPayLoad(data => {

        let id = data.id;

        Find.getListOfBlockUsers(id, data => {
            if (data === null)
                return Json.builder(Response.HTTP_NOT_FOUND);

            Find.getUserDetailsInUsersTable(data, result => {

                return Json.builder(Response.HTTP_OK, result);

            });

        });

    });

}


exports.listOfDevices = (req, res) => {


    Json.initializationRes(res);


    getAccessTokenPayLoad(data => {

        let id = data.id;

        Find.getListOfDevices(id, result => {
            return Json.builder(Response.HTTP_OK, result);
        });

    });

}