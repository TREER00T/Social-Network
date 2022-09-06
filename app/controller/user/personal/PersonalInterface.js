let Json = require('app/util/ReturnJson'),
    {
        getTokenPayLoad
    } = require('app/middleware/ApiPipeline'),
    Response = require('app/util/Response'),
    {
        InputException
    } = require('app/exception/InputException'),
    Update = require('app/model/update/user/users'),
    Find = require('app/model/find/user/users'),
    multer = require('multer'),
    {
        NULL
    } = require('opensql').queryHelper,
    multerImage = multer().single('image'),
    multerFile = multer().single('file'),
    {
        getHashData
    } = require('app/util/Generate'),
    File = require('app/util/File'),
    Util, {
        isUndefined,
        getFileFormat,
        IN_VALID_MESSAGE_TYPE,
        IN_VALID_OBJECT_KEY
    } = require('app/util/Util'),
    CommonInsert = require('app/model/add/insert/common/index'),
    Create = require('app/model/create/users'),
    Insert = require('app/model/add/insert/user/users'),
    FindInUser = require('app/model/find/user/users'),
    AddUserForeignKey = require('app/model/add/foreignKey/users'),
    Delete = require('app/model/remove/users/user');


exports.user = () => {

    getTokenPayLoad(data => {

        let userId = data.id;

        Find.getPersonalUserDetails(userId, result => {

            Json.builder(Response.HTTP_OK, result);

        });


    });


}


exports.editUsername = (req) => {

    let username = req.params?.id;

    if (isUndefined(username))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {

        let phone = data.phoneNumber;

        Find.isUsernameUsed(username.toString().trim(), result => {

            if (!result)
                return Json.builder(Response.HTTP_CONFLICT);

            Update.username(phone, username.toString().trim(), result => {
                if (!result)
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                Json.builder(Response.HTTP_OK);
            });

        });

    });


}


exports.editBio = (req) => {

    let bio = req.params?.bio;

    if (isUndefined(bio))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {

        let phone = data.phoneNumber;


        Update.bio(phone, bio, result => {
            if (!result)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            Json.builder(Response.HTTP_OK);
        });


    });


}


exports.editName = (req) => {

    let {lastName, firstName} = req.body;

    if (isUndefined(firstName))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {

        let phone = data.phoneNumber;

        Update.name(phone, firstName.toString().trim(), lastName, result => {
            if (!result)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            Json.builder(Response.HTTP_OK);
        });


    });


}


exports.twoAuth = (req) => {

    let {password, email} = req.body;

    if (isUndefined(email) || isUndefined(password) || password?.length < 6)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {

        let phone = data.phoneNumber;


        Update.passwordAndEmail(phone, getHashData(password, phone), email, result => {
            if (!result)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            Json.builder(Response.HTTP_OK);
        });

    });

}


exports.disableTwoAuth = () => {


    getTokenPayLoad(data => {

        let phone = data.phoneNumber;

        Update.passwordAndEmail(phone, NULL, NULL, result => {
            if (!result)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            Json.builder(Response.HTTP_OK);
        });

    });

}


exports.restPassword = (req) => {
    let oldPassword = req.body?.old,
        newPassword = req.body?.new;


    if (isUndefined(oldPassword) || isUndefined(newPassword))
        return Json.builder(Response.HTTP_BAD_REQUEST);


    getTokenPayLoad(data => {

        let phone = data.phoneNumber;

        Find.isValidPassword(phone, getHashData(oldPassword, phone), result => {

            if (!result)
                return Json.builder(Response.HTTP_FORBIDDEN);

            Update.password(phone, getHashData(newPassword, phone), result => {
                if (!result)
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                Json.builder(Response.HTTP_OK);
            });

        });

    });

}


exports.uploadAvatar = (req, res) => {


    getTokenPayLoad(data => {

        let phone = data.phoneNumber;


        multerImage(req, res, () => {


            let file = req.file;

            if (isUndefined(file))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            let {
                fileUrl
            } = File.validationAndWriteFile(file.buffer, getFileFormat(file.originalname));

            Update.img(phone, fileUrl, result => {
                if (!result)
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                Json.builder(Response.HTTP_OK);
            });

        });

    });

}


exports.listOfBlockUsers = () => {

    getTokenPayLoad(data => {

        let id = data.id;

        Find.getListOfBlockUsers(id, data => {
            if (isUndefined(data))
                return Json.builder(Response.HTTP_NOT_FOUND);

            Find.getUserDetailsInUsersTable(data, result => {

                Json.builder(Response.HTTP_OK, result);

            });

        });

    });

}


exports.listOfDevices = () => {

    getTokenPayLoad(data => {

        let id = data.id;

        Find.getListOfDevices(id, result => {
            Json.builder(Response.HTTP_OK, result);
        });

    });

}


exports.listOfMessage = (req) => {
    let queryObject = req.query,
        limit = queryObject?.limit,
        page = queryObject?.page,
        order = queryObject?.order,
        sort = queryObject?.sort,
        type = queryObject?.type,
        search = queryObject?.search,
        getLimit = !isUndefined(limit) ? limit : 1,
        getSort = !isUndefined(sort) ? sort : 'DESC',
        getOrder = !isUndefined(order) ? order : 'id',
        getPage = !isUndefined(page) ? page : 1,
        startFrom = (getPage - 1) * limit;


    getTokenPayLoad(data => {

        let phone = data.phoneNumber;

        FindInUser.isSavedMessageCreated(phone, result => {

            if (!result)
                return Json.builder(Response.HTTP_NOT_FOUND);


            Find.getCountOfListMessage(phone + 'SavedMessages', count => {

                let totalPages = Math.ceil(count / getLimit);

                FindInUser.getListOfMessage(phone + 'SavedMessages', startFrom, getLimit, getOrder, getSort, type, search, result => {

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


exports.deleteSavedMessage = () => {


    getTokenPayLoad(data => {


        let phone = data.phoneNumber;

        FindInUser.isSavedMessageCreated(phone, result => {

            if (!result)
                return Json.builder(Response.HTTP_NOT_FOUND);

            Delete.savedMessage(phone);

            Json.builder(Response.HTTP_OK);

        });

    });

}


exports.createSavedMessage = () => {


    getTokenPayLoad(data => {


        let phone = data.phoneNumber;

        FindInUser.isSavedMessageCreated(phone, result => {

            if (result)
                return Json.builder(Response.HTTP_CONFLICT);

            Create.savedMessages(phone);
            AddUserForeignKey.savedMessages(phone);

            Json.builder(Response.HTTP_CREATED);

        });

    });

}


exports.account = () => {


    getTokenPayLoad(data => {


        let phone = data.phoneNumber,
            userId = data.id;

        Json.builder(Response.HTTP_OK);

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


exports.addMessage = (req) => {


    getTokenPayLoad(data => {

        let phone = data.phoneNumber;

        Util.validateMessage(req.body, data => {

            if (data === IN_VALID_MESSAGE_TYPE || IN_VALID_OBJECT_KEY)
                return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);

            FindInUser.isSavedMessageCreated(phone, result => {

                if (!result)
                    return Json.builder(Response.HTTP_NOT_FOUND);

                Insert.messageIntoUserSavedMessage(phone, data);

                Json.builder(Response.HTTP_CREATED);
            });

        });


    });

}


exports.uploadFile = (req, res) => {


    getTokenPayLoad(data => {

        let userId = data.id,
            phone = data.phoneNumber;

        Find.isExistUser(userId, isInDb => {

            if (!isInDb)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);


            multerFile(req, res, () => {

                let data = JSON.parse(JSON.stringify(req.body));

                Find.isSavedMessageCreated(phone, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_NOT_FOUND);

                    Util.validateMessage(data, result => {

                        if (result === (IN_VALID_OBJECT_KEY || IN_VALID_MESSAGE_TYPE))
                            return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);


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


                        CommonInsert.message('`' + phone + 'SavedMessages`', data, {
                            conversationType: 'Personal'
                        }, result => {
                            Json.builder(Response.HTTP_OK, {
                                insertId: result
                            });
                        });

                    });

                });

            });

        });

    });


};


exports.deleteMessage = (req) => {

    let listOfId;

    try {
        listOfId = JSON.parse(req.body.toString())['listOfId'];
    } catch (e) {
        InputException(e);
    }

    if (isUndefined(listOfId))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {

        let phone = data.phoneNumber;

        FindInUser.isSavedMessageCreated(phone, result => {

            if (!result)
                return Json.builder(Response.HTTP_NOT_FOUND);

            Delete.itemInSavedMessage(phone, listOfId);

            Json.builder(Response.HTTP_OK);

        });

    });

}


exports.editMessage = (req) => {

    let reqData = req.body,
        id = reqData?.id,
        dataWithOutIdObject;

    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    delete reqData?.id;
    dataWithOutIdObject = reqData;


    getTokenPayLoad(data => {

        let phone = data.phoneNumber;

        Util.validateMessage(dataWithOutIdObject, result => {

            if (result === IN_VALID_MESSAGE_TYPE || IN_VALID_OBJECT_KEY)
                return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);

            FindInUser.isSavedMessageCreated(phone, result => {

                if (!result)
                    return Json.builder(Response.HTTP_NOT_FOUND);
                Update.itemInSavedMessage(phone, id);

                Json.builder(Response.HTTP_OK);

            });

        });

    });

}