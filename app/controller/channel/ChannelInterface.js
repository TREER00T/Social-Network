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
    } = require('app/middleware/ApiPipeline'),
    File = require('app/util/File'),
    Util = require('app/util/Util'),
    Generate = require('app/util/Generate');


exports.create = (req, res) => {


    getTokenPayLoad(data => {

        let userId = data.id;

        multerImage(req, res, () => {

            let file = req.file;
            let fileUrl;
            let isOwner = 1;


            let name = req.body?.name;
            let isUndefinedName = (name === undefined);

            if (isUndefinedName)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            if (file !== undefined) {
                fileUrl = File.validationAndWriteFile(file.buffer, Util.getFileFormat(file.originalname)).fileUrl;
            }

            Insert.channel(name.toString().trim(), Generate.makeIdForInviteLink(), Util.getRandomHexColor(), fileUrl, id => {

                if (id === null)
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                Create.channelContents(id);
                AddChannelForeignKey.channelContents(id);
                Insert.userIntoChannelsAdmins(userId, id, isOwner);
                Insert.userIntoChannel(userId, id);

                return Json.builder(Response.HTTP_CREATED);
            });

        });

    });


}


exports.deleteChannel = (req) => {


    let id = req.params?.id;


    getTokenPayLoad(data => {

        let userId = data.id;

        Find.channelId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                Find.isOwnerOfChannel(userId, id, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_FORBIDDEN);

                    Delete.channel(id);
                    Delete.channelAdmins(id);
                    Delete.channelUsers(id);
                    DeleteInUser.channelInListOfUserChannels(id);
                });

            });

        });

    });

}


exports.uploadFile = (req, res) => {


    getTokenPayLoad(data => {

        let userId = data.id;

        multerFile(req, res, () => {

            let data = JSON.parse(JSON.stringify(req.body));

            let receiverId = data?.receiverId;
            if (receiverId !== undefined)
                delete data?.receiverId;

            let channelId = data?.channelId;
            if (channelId === undefined)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            delete data?.channelId;

            Find.channelId(channelId, isDefined => {

                if (!isDefined)
                    return Json.builder(Response.HTTP_NOT_FOUND);

                FindInUser.isExistUser(userId, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_USER_NOT_FOUND);

                    Find.isOwnerOrAdminOfChannel(userId, channelId, result => {

                        if (!result)
                            return Json.builder(Response.HTTP_FORBIDDEN);

                        Find.isJoinedInChannel(channelId, userId, result => {

                            if (!result)
                                return Json.builder(Response.HTTP_NOT_FOUND);


                            Util.validateMessage(data, result => {

                                if (result === (Util.IN_VALID_OBJECT_KEY || Util.IN_VALID_MESSAGE_TYPE))
                                    return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);


                                data?.senderId = userId;
                                let file = req.file;

                                if (file !== undefined) {

                                    let {
                                        fileUrl,
                                        fileSize
                                    } = File.validationAndWriteFile(file.buffer, Util.getFileFormat(file.originalname));

                                    data['fileUrl'] = fileUrl;
                                    data['fileSize'] = fileSize;
                                    data['fileName'] = file.originalname;


                                    CommonInsert.message('`' + channelId + 'ChannelContents`', data, {
                                        conversationType: 'Channel'
                                    }, result => {
                                        return Json.builder(Response.HTTP_OK, {
                                            insertId: result
                                        });
                                    });

                                }

                                return Json.builder(Response.HTTP_BAD_REQUEST);

                            });

                        });

                    });

                });

            });

        });

    });


};


exports.changeName = (req) => {

    let {id, name} = req.body;

    if (name < 1 || name === undefined)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {

        let userId = data.id;

        Find.channelId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                Find.isOwnerOfChannel(userId, id, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_FORBIDDEN);

                    Update.name(id, name.toString().trim(), result => {
                        if (!result)
                            return Json.builder(Response.HTTP_BAD_REQUEST);

                        return Json.builder(Response.HTTP_OK);
                    });

                });

            });

        });

    });

}


exports.changeDescription = (req) => {

    let {id, description} = req.body;

    getTokenPayLoad(data => {

        let userId = data.id;

        Find.channelId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                Find.isOwnerOfChannel(userId, id, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_FORBIDDEN);

                    Update.description(id, description, result => {
                        if (!result)
                            return Json.builder(Response.HTTP_BAD_REQUEST);

                        return Json.builder(Response.HTTP_OK);
                    });

                });

            });

        });

    });

}

exports.uploadAvatar = (req, res) => {


    getTokenPayLoad(data => {

        let userId = data.id;


        multerImage(req, res, () => {

            let id = req.body?.id;

            Find.channelId(id, isDefined => {

                if (!isDefined)
                    return Json.builder(Response.HTTP_NOT_FOUND);

                FindInUser.isExistUser(userId, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_USER_NOT_FOUND);

                    Find.isOwnerOfChannel(userId, id, result => {

                        if (!result)
                            return Json.builder(Response.HTTP_FORBIDDEN);

                        let file = req.file;


                        if (file === undefined)
                            return Json.builder(Response.HTTP_BAD_REQUEST);

                        let {
                            fileUrl
                        } = File.validationAndWriteFile(file.buffer, Util.getFileFormat(file.originalname));

                        Update.img(id, fileUrl, result => {
                            if (!result)
                                return Json.builder(Response.HTTP_BAD_REQUEST);

                            return Json.builder(Response.HTTP_OK);
                        });

                    });

                });

            });

        });

    });


}


exports.changeToInviteLink = (req) => {

    let id = req.body?.id;

    getTokenPayLoad(data => {


        let userId = data.id;

        Find.channelId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                Find.isOwnerOfChannel(userId, id, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_FORBIDDEN);

                    let link = Generate.makeIdForInviteLink();
                    Update.inviteLink(id, link, result => {
                        if (!result)
                            return Json.builder(Response.HTTP_BAD_REQUEST);

                        return Json.builder(Response.HTTP_OK, {
                            inviteLink: link
                        });

                    });

                });

            });

        });

    });

}

exports.changeToPublicLink = (req) => {

    let {id, publicLink} = req.body;

    getTokenPayLoad(data => {


        let userId = data.id;

        Find.channelId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                Find.isOwnerOfChannel(userId, id, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_FORBIDDEN);

                    let publicLink = Generate.makeIdForPublicLink(publicLink);

                    Find.isPublicKeyUsed(publicLink, result => {
                        if (!result)
                            return Json.builder(Response.HTTP_CONFLICT);

                        Update.publicLink(id, publicLink, result => {
                            if (!result)
                                return Json.builder(Response.HTTP_BAD_REQUEST);

                            return Json.builder(Response.HTTP_OK);
                        });

                    });

                });

            });

        });

    });

}


exports.joinUser = (req) => {


    let id = req.body?.id;

    getTokenPayLoad(data => {


        let userId = data.id;

        Find.channelId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                Find.isJoinedInChannel(id, userId, result => {

                    if (result)
                        return Json.builder(Response.HTTP_CONFLICT);

                    Insert.userIntoChannel(id, userId);
                    InsertInUser.channelIntoListOfUserChannels(id, userId);


                    return Json.builder(Response.HTTP_CREATED);
                });

            });

        });

    });

}


exports.addAdmin = (req) => {


    let id = req.body?.id;
    let userIdForNewAdmin = req.body?.userId;

    getTokenPayLoad(data => {


        let userId = data.id;

        Find.channelId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                FindInUser.isExistUser(userIdForNewAdmin, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_USER_NOT_FOUND);


                    Find.isOwnerOfChannel(userId, id, result => {

                        if (!result)
                            return Json.builder(Response.HTTP_FORBIDDEN);

                        Find.isJoinedInChannel(id, userIdForNewAdmin, result => {

                            if (!result)
                                return Json.builder(Response.HTTP_NOT_FOUND);

                            Find.isUserAdminOfChannel(id, userIdForNewAdmin, result => {

                                if (result)
                                    return Json.builder(Response.HTTP_CONFLICT);

                                let isNotOwner = 0;
                                Insert.userIntoChannelsAdmins(userIdForNewAdmin, id, isNotOwner);


                                return Json.builder(Response.HTTP_CREATED);
                            });

                        });

                    });

                });
            });

        });

    });

}

exports.deleteAdmin = (req) => {


    let id = req.body?.id;
    let userIdForDeleteAdmin = req.body?.userId;

    getTokenPayLoad(data => {


        let userId = data.id;

        Find.channelId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                FindInUser.isExistUser(userIdForDeleteAdmin, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_USER_NOT_FOUND);


                    Find.isOwnerOfChannel(userId, id, result => {

                        if (!result)
                            return Json.builder(Response.HTTP_FORBIDDEN);


                        Find.isUserAdminOfChannel(id, userIdForDeleteAdmin, result => {

                            if (!result)
                                return Json.builder(Response.HTTP_NOT_FOUND);

                            Delete.userIntoChannelAdmins(id, userIdForDeleteAdmin);


                            return Json.builder(Response.HTTP_OK);
                        });

                    });

                });
            });

        });

    });

}


exports.leaveUser = (req) => {


    let id = req.body?.id;

    getTokenPayLoad(data => {


        let userId = data.id;

        Find.channelId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                Find.isJoinedInChannel(id, userId, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_NOT_FOUND);

                    Delete.userIntoChannel(id, userId);
                    DeleteInUser.channelIntoListOfUserChannels(id, userId);


                    return Json.builder(Response.HTTP_OK);
                });

            });

        });

    });

}


exports.listOfMessage = (req) => {


    let {id, limit, page, order, sort, type, search} = req.query;

    let getLimit = (limit !== undefined) ? limit : 15;
    let getSort = (sort !== undefined) ? sort : 'DESC';
    let getOrder = (order !== undefined) ? order : 'id';
    let getPage = (page !== undefined) ? page : 1;

    let startFrom = (getPage - 1) * limit;


    getTokenPayLoad(data => {


        let userId = data.id;

        FindInUser.getTableNameForListOfUserChannels(id, userId, result => {

            if (!result)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);


            Find.getCountOfListMessage(id, count => {

                let totalPages = Math.ceil(count / getLimit);

                FindInUser.getListOfMessage('`' + id + 'ChannelContents`', startFrom, getLimit, getOrder, getSort, type, search, result => {

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


exports.info = (req) => {

    let id = req.body?.id;


    getTokenPayLoad(() => {


        Find.channelId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);


            Find.getChannelInfo(id, result => {

                Find.getCountOfUserInChannel(id, count => {

                    return Json.builder(Response.HTTP_OK, result, {
                        memberSize: count
                    });

                })

            });

        });


    });

}


exports.allUsers = (req) => {

    let id = req.body?.id;


    getTokenPayLoad(data => {

        let userId = data.id;

        Find.channelId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);


            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);


                Find.isOwnerOrAdminOfChannel(userId, id, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_FORBIDDEN);

                    Find.getAllUsersForChannel(id, data => {

                        if (data === null)
                            return Json.builder(Response.HTTP_NOT_FOUND);

                        FindInUser.getUserDetailsInUsersTableForMember(data, result => {

                            return Json.builder(Response.HTTP_OK, result);

                        });

                    });

                });

            });

        });


    });

}