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
    Util = require('app/util/Util'),
    Create = require('app/model/create/users'),
    FindInUser = require('app/model/find/user/users'),
    AddUserForeignKey = require('app/model/add/foreignKey/users'),
    Delete = require('app/model/remove/users/user');


exports.user = () => {

    getAccessTokenPayLoad(data => {

        let userId = data.id;

        Find.getPersonalUserDetails(userId, result => {

            return Json.builder(Response.HTTP_OK, result);
        });


    });


}


exports.editUsername = (req) => {

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


exports.editBio = (req) => {

    let bio = req.params.bio;

    getAccessTokenPayLoad(data => {

        let phone = data.phoneNumber;


        Update.bio(phone, bio, result => {
            if (!result)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            return Json.builder(Response.HTTP_OK);
        });


    });


}


exports.editName = (req) => {

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


exports.twoAuth = (req) => {

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


exports.disableTwoAuth = () => {


    getAccessTokenPayLoad(data => {

        let phone = data.phoneNumber;

        Update.passwordAndEmail(phone, NULL, NULL, result => {
            if (!result)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            return Json.builder(Response.HTTP_OK);
        });

    });

}


exports.restPassword = (req) => {


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


    getAccessTokenPayLoad(data => {

        let phone = data.phoneNumber;


        multerImage(req, res, () => {


            let file = req.file;

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


exports.listOfBlockUsers = () => {

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


exports.listOfDevices = () => {

    getAccessTokenPayLoad(data => {

        let id = data.id;

        Find.getListOfDevices(id, result => {
            return Json.builder(Response.HTTP_OK, result);
        });

    });

}


exports.listOfMessage = (req) => {


    let {limit, page, order, sort, type, search} = req.query;

    let getLimit = (limit !== undefined) ? limit : 15;
    let getSort = (sort !== undefined) ? sort : 'DESC';
    let getOrder = (order !== undefined) ? order : 'id';

    let startFrom = (page - 1) * limit;


    getAccessTokenPayLoad(data => {


        let phone = data.phoneNumber;

        FindInUser.isSavedMessageCreated(phone, result => {

            if (!result)
                return Json.builder(Response.HTTP_NOT_FOUND);


            Find.getCountOfListMessage(phone + 'SavedMessages', count => {

                let totalPages = Math.ceil(count / getLimit);

                FindInUser.getListOfMessage(phone + 'SavedMessages', startFrom, getLimit, getOrder, getSort, type, search, result => {

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


exports.deleteSavedMessage = () => {


    getAccessTokenPayLoad(data => {


        let phone = data.phoneNumber;

        FindInUser.isSavedMessageCreated(phone, result => {

            if (!result)
                return Json.builder(Response.HTTP_NOT_FOUND);

            Delete.savedMessage(phone);

            return Json.builder(Response.HTTP_OK);

        });

    });

}


exports.createSavedMessage = () => {


    getAccessTokenPayLoad(data => {


        let phone = data.phoneNumber;

        FindInUser.isSavedMessageCreated(phone, result => {

            if (result)
                return Json.builder(Response.HTTP_CONFLICT);

            Create.savedMessages(phone);
            AddUserForeignKey.savedMessages(phone);

            return Json.builder(Response.HTTP_CREATED);

        });

    });

}


exports.account = () => {


    getAccessTokenPayLoad(data => {


        let phone = data.phoneNumber;
        let userId = data.id;

        Delete.savedMessage(phone);
        Delete.userInAllUsersBlockList(userId);
        Delete.userInUsersTable(userId);
        Delete.userInDevices(userId);
        FindInUser.getListOfUserE2Es(userId, result => {
            if (result !== null)
                Delete.userInAllUsersE2E(result, userId);
        });
        FindInUser.getListOfUserGroup(userId, result => {
            if (result !== null)
                Delete.userInAllUsersGroup(result, userId);
        });
        FindInUser.getListOfUserChannel(userId, result => {
            if (result !== null)
                Delete.userInAllUsersChannel(result, userId);
        });


    });

}