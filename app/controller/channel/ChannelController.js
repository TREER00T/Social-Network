let Json = require('../../util/ReturnJson'),
    Response = require('../../util/Response'),
    multer = require('multer'),
    Insert = require('../../model/add/insert/channels/channel'),
    InsertInUser = require('../../model/add/insert/user/users'),
    Create = require('../../model/create/channels'),
    FindInChannel = require('../../model/find/channels/channel'),
    FindInUser = require('../../model/find/user/users'),
    CommonInsert = require('../../model/add/insert/common/index'),
    DeleteInChannel = require('../../model/remove/channels/channel'),
    UpdateInChannel = require('../../model/update/channels/channel'),
    AddChannelForeignKey = require('../../model/add/foreignKey/channels'),
    DeleteInUser = require('../../model/remove/users/user'),
    multerImage = multer().single('image'),
    multerFile = multer().single('file'),
    {
        getTokenPayLoad
    } = require('../../middleware/RouterUtil'),
    File = require('../../util/File'),
    Util, {
        isUndefined,
        getFileFormat,
        getRandomHexColor,
        IN_VALID_MESSAGE_TYPE,
        IN_VALID_OBJECT_KEY
    } = require('../../util/Util'),
    Generate = require('../../util/Generate');


let validationChannelAndUser = (roomId, userId, cb) => {

        FindInChannel.id(roomId, isDefined => {

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

            FindInChannel.isOwner(userId, roomId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_FORBIDDEN);

                cb();
            });

        });

    },
    validationChannelAndUserAndOwnerOrAdmin = (roomId, userId, cb) => {

        validationChannelAndUser(roomId, userId, () => {

            FindInChannel.isOwnerOrAdmin(userId, roomId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_FORBIDDEN);

                cb();
            });

        });

    },
    validationChannelAndUserAndJoinedInChannel = (roomId, userId, cb) => {

        validationChannelAndUser(roomId, userId, () => {

            FindInChannel.isJoined(roomId, userId, result => {

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


            FindInChannel.isOwner(userId, channelId, result => {

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
                fileUrl = File.validationAndWriteFile({
                    size: file.size,
                    dataBinary: file.buffer,
                    format: getFileFormat(file.originalname)
                }).url;


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
            DeleteInChannel.channel(id);
            DeleteInChannel.admins(id);
            DeleteInChannel.users(id);
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

                FindInChannel.isJoined(channelId, userId, result => {

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
                            url,
                            size
                        } = File.validationAndWriteFile({
                            size: file.size,
                            dataBinary: file.buffer,
                            format: getFileFormat(file.originalname)
                        });

                        data['fileUrl'] = url;
                        data['fileSize'] = size;
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

            UpdateInChannel.name(id, name.toString().trim(), result => {
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

            UpdateInChannel.description(id, description, result => {
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

                if (!isUndefined(file))
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                let {
                    url
                } = File.validationAndWriteFile({
                    size: file.size,
                    dataBinary: file.buffer,
                    format: getFileFormat(file.originalname)
                });

                UpdateInChannel.img(id, url, result => {
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
            UpdateInChannel.inviteLink(id, link, result => {
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

            FindInChannel.isPublicKeyUsed(publicLink, result => {
                if (!result)
                    return Json.builder(Response.HTTP_CONFLICT);

                UpdateInChannel.publicLink(id, publicLink, result => {
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

                FindInChannel.isJoined(id, userIdForNewAdmin, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_NOT_FOUND);

                    FindInChannel.isAdmin(id, userIdForNewAdmin, result => {

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

                FindInChannel.isAdmin(id, userIdForDeleteAdmin, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_NOT_FOUND);

                    DeleteInChannel.admin(id, userIdForDeleteAdmin);


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

            DeleteInChannel.userInChannel(id, userId);
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


            FindInChannel.getCountOfListMessage(id, count => {

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


        FindInChannel.id(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);


            FindInChannel.getInfo(id, result => {

                FindInChannel.getCountOfUsers(id, count => {

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

            FindInChannel.getAllUsers(id, data => {

                if (isUndefined(data))
                    return Json.builder(Response.HTTP_NOT_FOUND);

                FindInUser.getUserDetailsInUsersTableForMember(data, result => {

                    Json.builder(Response.HTTP_OK, result);

                });

            });

        });


    });

}