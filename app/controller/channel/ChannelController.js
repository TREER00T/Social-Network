let Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    multer = require('multer'),
    Insert = require('app/model/add/insert/channels/channel'),
    InsertInUser = require('app/model/add/insert/user/users'),
    Create = require('app/model/create/channels'),
    Find = require('app/model/find/channels/channel'),
    FindInUser = require('app/model/find/user/users'),
    CommonInsert = require('app/model/add/insert/common/index'),
    Delete = require('app/model/remove/channels/channel'),
    Update = require('app/model/update/channels/channel'),
    AddChannelForeignKey = require('app/model/add/foreignKey/channels'),
    DeleteInUser = require('app/model/remove/users/user'),
    multerImage = multer().single('image'),
    multerFile = multer().single('file'),
    {
        getTokenPayLoad
    } = require('app/middleware/RouterUtil'),
    File = require('app/util/File'),
    Util, {
        isUndefined,
        getFileFormat,
        getRandomHexColor,
        IN_VALID_MESSAGE_TYPE,
        IN_VALID_OBJECT_KEY
    } = require('app/util/Util'),
    Generate = require('app/util/Generate');


let validationChannelAndUser = (roomId, userId, cb) => {

        Find.channelId(roomId, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExist(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                cb();
            });

        });

    },
    validationChannelAndUserAndOwnerUser = (roomId, userId, cb) => {

        validationChannelAndUser(roomId, userId, () => {

            Find.isOwnerOfChannel(userId, roomId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_FORBIDDEN);

                cb();
            });

        });

    },
    validationChannelAndUserAndOwnerOrAdmin = (roomId, userId, cb) => {

        validationChannelAndUser(roomId, userId, () => {

            Find.isOwnerOrAdminOfChannel(userId, roomId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_FORBIDDEN);

                cb();
            });

        });

    },
    validationChannelAndUserAndJoinedInChannel = (roomId, userId, cb) => {

        validationChannelAndUser(roomId, userId, () => {

            Find.isJoinedInChannel(roomId, userId, result => {

                if (result)
                    return Json.builder(Response.HTTP_NOT_FOUND);

                cb();
            });

        });

    },
    isExistUserAndIsOwner = (userIdForAdmin, userId, channelId, cb) => {

        FindInUser.isExist(userIdForAdmin, result => {

            if (!result)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);


            Find.isOwnerOfChannel(userId, channelId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_FORBIDDEN);

                cb();
            });

        });

    };


exports.create = (req, res) => {


    getTokenPayLoad(data => {

        let userId = data.id;

        multerImage(req, res, () => {

            let file = req.file,
                fileUrl,
                isOwner = 1,
                name = req.body?.name;

            if (isUndefined(name))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            if (!isUndefined(file))
                fileUrl = File.validationAndWriteFile(file.buffer, getFileFormat(file.originalname)).fileUrl;


            Insert.channel(name.toString().trim(), Generate.makeIdForInviteLink(), getRandomHexColor(), fileUrl, id => {

                if (isUndefined(id))
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                Create.channelContents(id);
                AddChannelForeignKey.channelContents(id);
                Insert.userIntoChannelsAdmins(userId, id, isOwner);
                Insert.userIntoChannel(userId, id);

                Json.builder(Response.HTTP_CREATED);
            });

        });

    });


}


exports.deleteChannel = (req) => {


    let id = req.params?.id;


    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);


    getTokenPayLoad(data => {

        let userId = data.id;

        validationChannelAndUserAndOwnerUser(id, userId, () => {
            Delete.channel(id);
            Delete.channelAdmins(id);
            Delete.channelUsers(id);
            DeleteInUser.channelInListOfUserChannels(id);
        });

    });

}


exports.uploadFile = (req, res) => {


    getTokenPayLoad(data => {

        let userId = data.id;

        multerFile(req, res, () => {

            let data = JSON.parse(JSON.stringify(req.body)),
                receiverId = data?.receiverId,
                channelId = data?.channelId;

            if (isUndefined(channelId))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            if (!isUndefined(receiverId))
                delete data?.receiverId;

            delete data?.channelId;

            validationChannelAndUserAndOwnerOrAdmin(channelId, userId, () => {

                Find.isJoinedInChannel(channelId, userId, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_NOT_FOUND);


                    Util.validateMessage(data, result => {

                        if (result === (IN_VALID_OBJECT_KEY || IN_VALID_MESSAGE_TYPE))
                            return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);


                        data['senderId'] = userId;
                        let file = req.file;

                        if (!isUndefined(file))
                            return Json.builder(Response.HTTP_BAD_REQUEST);

                        let {
                            fileUrl,
                            fileSize
                        } = File.validationAndWriteFile(file.buffer, getFileFormat(file.originalname));

                        data['fileUrl'] = fileUrl;
                        data['fileSize'] = fileSize;
                        data['fileName'] = file.originalname;


                        CommonInsert.message('`' + channelId + 'ChannelContents`', data, {
                            conversationType: 'Channel'
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


};


exports.changeName = (req) => {

    let bodyObject = req.body,
        name = bodyObject?.body,
        id = bodyObject?.body;

    if (isUndefined(name) || isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {

        let userId = data.id;

        validationChannelAndUserAndOwnerUser(id, userId, () => {

            Update.name(id, name.toString().trim(), result => {
                if (!result)
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                Json.builder(Response.HTTP_OK);
            });

        });

    });

}


exports.changeDescription = (req) => {

    let bodyObject = req.body,
        id = bodyObject?.id,
        description = bodyObject?.description;


    if (isUndefined(id) || isUndefined(description))
        return Json.builder(Response.HTTP_BAD_REQUEST);


    getTokenPayLoad(data => {

        let userId = data.id;

        validationChannelAndUserAndOwnerUser(id, userId, () => {

            Update.description(id, description, result => {
                if (!result)
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                Json.builder(Response.HTTP_OK);
            });


        });

    });

}

exports.uploadAvatar = (req, res) => {


    getTokenPayLoad(data => {

        let userId = data.id;


        multerImage(req, res, () => {

            let id = req.body?.id;

            if (isUndefined(id))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            validationChannelAndUserAndOwnerUser(id, userId, () => {

                let file = req.file;

                if (file === undefined)
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                let {
                    fileUrl
                } = File.validationAndWriteFile(file.buffer, getFileFormat(file.originalname));

                Update.img(id, fileUrl, result => {
                    if (!result)
                        return Json.builder(Response.HTTP_BAD_REQUEST);

                    Json.builder(Response.HTTP_CREATED);
                });

            });

        });

    });


}


exports.changeToInviteLink = (req) => {

    let id = req.body?.id;

    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {


        let userId = data.id;

        validationChannelAndUserAndOwnerUser(id, userId, () => {

            let link = Generate.makeIdForInviteLink();
            Update.inviteLink(id, link, result => {
                if (!result)
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                Json.builder(Response.HTTP_OK, {
                    inviteLink: link
                });

            });

        });

    });

}

exports.changeToPublicLink = (req) => {

    let bodyObject = req.body,
        id = bodyObject?.id,
        publicLink = bodyObject?.publicLink;

    if (isUndefined(id) || isUndefined(publicLink))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {


        let userId = data.id;


        validationChannelAndUserAndOwnerUser(id, userId, () => {

            let publicLink = Generate.makeIdForPublicLink(publicLink);

            Find.isPublicKeyUsed(publicLink, result => {
                if (!result)
                    return Json.builder(Response.HTTP_CONFLICT);

                Update.publicLink(id, publicLink, result => {
                    if (!result)
                        return Json.builder(Response.HTTP_BAD_REQUEST);

                    Json.builder(Response.HTTP_OK);
                });

            });

        });

    });

}


exports.joinUser = (req) => {


    let bodyObject = req.body,
        id = bodyObject?.id,
        targetUserId = bodyObject?.userId;


    if (isUndefined(id) || isUndefined(targetUserId))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {


        let userId = data.id;

        validationChannelAndUserAndJoinedInChannel(id, userId, () => {

            let getUserId = isUndefined(targetUserId) ? userId : targetUserId;

            Insert.userIntoChannel(id, getUserId);
            InsertInUser.channelIntoListOfUserChannels(id, getUserId);


            Json.builder(Response.HTTP_CREATED);
        });

    });


}


exports.addAdmin = (req) => {


    let bodyObject = req.body,
        id = bodyObject?.id,
        userIdForNewAdmin = bodyObject?.userId;

    if (isUndefined(id) || isUndefined(userIdForNewAdmin))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {


        let userId = data.id;

        validationChannelAndUser(id, userId, () => {

            isExistUserAndIsOwner(userIdForNewAdmin, userId, id, () => {

                Find.isJoinedInChannel(id, userIdForNewAdmin, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_NOT_FOUND);

                    Find.isUserAdminOfChannel(id, userIdForNewAdmin, result => {

                        if (result)
                            return Json.builder(Response.HTTP_CONFLICT);

                        let isNotOwner = 0;
                        Insert.userIntoChannelsAdmins(userIdForNewAdmin, id, isNotOwner);


                        Json.builder(Response.HTTP_CREATED);
                    });

                });

            });

        });

    });

}

exports.deleteAdmin = (req) => {


    let bodyObject = req.body,
        id = bodyObject?.id,
        userIdForDeleteAdmin = bodyObject?.userId;

    if (isUndefined(id) || isUndefined(userIdForDeleteAdmin))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {


        let userId = data.id;

        validationChannelAndUser(id, userId, () => {

            isExistUserAndIsOwner(userIdForDeleteAdmin, userId, id, () => {

                Find.isUserAdminOfChannel(id, userIdForDeleteAdmin, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_NOT_FOUND);

                    Delete.userIntoChannelAdmins(id, userIdForDeleteAdmin);


                    Json.builder(Response.HTTP_OK);
                });

            });

        });

    });

}


exports.leaveUser = (req) => {


    let id = req.body?.id;


    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);


    getTokenPayLoad(data => {


        let userId = data.id;

        validationChannelAndUserAndJoinedInChannel(id, userId, () => {

            Delete.userIntoChannel(id, userId);
            DeleteInUser.channelIntoListOfUserChannels(id, userId);

            Json.builder(Response.HTTP_OK);
        });


    });

}


exports.listOfMessage = (req) => {

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


    getTokenPayLoad(data => {


        let userId = data.id;

        FindInUser.getTableNameForListOfUserChannels(id, userId, result => {

            if (!result)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);


            Find.getCountOfListMessage(id, count => {

                let totalPages = Math.ceil(count / getLimit);

                FindInUser.getListOfMessage('`' + id + 'ChannelContents`', startFrom, getLimit, getOrder, getSort, type, search, result => {

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


exports.info = (req) => {

    let id = req.body?.id;


    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);


    getTokenPayLoad(() => {


        Find.channelId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);


            Find.getChannelInfo(id, result => {

                Find.getCountOfUserInChannel(id, count => {

                    Json.builder(Response.HTTP_OK, result, {
                        memberSize: count
                    });

                })

            });

        });


    });

}


exports.allUsers = (req) => {

    let id = req.body?.id;


    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);


    getTokenPayLoad(data => {

        let userId = data.id;

        validationChannelAndUserAndOwnerOrAdmin(id, userId, () => {

            Find.getAllUsersForChannel(id, data => {

                if (isUndefined(data))
                    return Json.builder(Response.HTTP_NOT_FOUND);

                FindInUser.getUserDetailsInUsersTableForMember(data, result => {

                    Json.builder(Response.HTTP_OK, result);

                });

            });

        });


    });

}