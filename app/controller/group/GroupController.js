let Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    multer = require('multer'),
    Insert = require('app/model/add/insert/groups/group'),
    InsertInUser = require('app/model/add/insert/user/users'),
    Create = require('app/model/create/groups'),
    Find = require('app/model/find/groups/group'),
    FindInUser = require('app/model/find/user/users'),
    Delete = require('app/model/remove/groups/group'),
    CommonInsert = require('app/model/add/insert/common/index'),
    Update = require('app/model/update/groups/group'),
    AddGroupForeignKey = require('app/model/add/foreignKey/groups'),
    DeleteInUser = require('app/model/remove/users/user'),
    multerImage = multer().single('image'),
    multerFile = multer().single('file'),
    {
        getTokenPayLoad
    } = require('app/middleware/ApiPipeline'),
    File = require('app/util/File'),
    Util, {
        isUndefined,
        getFileFormat,
        getRandomHexColor,
        IN_VALID_MESSAGE_TYPE,
        IN_VALID_OBJECT_KEY
    } = require('app/util/Util'),
    Generate = require('app/util/Generate');



let validationGroupAndUser = (roomId, userId, cb) => {

        Find.groupId(roomId, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                cb();
            });

        });

    },
    validationGroupAndUserAndOwnerUser = (roomId, userId, cb) => {

        validationGroupAndUser(roomId, userId, () => {

            Find.isOwnerOfGroup(userId, roomId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_FORBIDDEN);

                cb();
            });

        });

    },
    validationGroupAndUserAndJoinedInGroup = (roomId, userId, cb) => {

        validationGroupAndUser(roomId, userId, () => {

            Find.isJoinedInGroup(roomId, userId, result => {

                if (result)
                    return Json.builder(Response.HTTP_NOT_FOUND);

                cb();
            });

        });

    },
    isExistAndIsOwnerOfGroup = (userIdForAdmin, userId, groupId, cb) => {

        FindInUser.isExistUser(userIdForAdmin, result => {

            if (!result)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);


            Find.isOwnerOfGroup(userId, groupId, result => {

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

            let name = req.body?.name;

            if (isUndefined(name))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            let file = req.file,
                fileUrl,
                isOwner = 1;


            if (!isUndefined(file))
                fileUrl = File.validationAndWriteFile(file.buffer, getFileFormat(file.originalname)).fileUrl;


            Insert.group(name.toString().trim(), Generate.makeIdForInviteLink(), getRandomHexColor(), fileUrl, id => {

                if (isUndefined(id))
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                Create.groupContents(id);
                AddGroupForeignKey.groupContents(id);
                Insert.userIntoGroupAdmins(userId, id, isOwner);
                Insert.userIntoGroup(userId, id);

                Json.builder(Response.HTTP_CREATED);
            });

        });

    });


}


exports.uploadFile = (req, res) => {


    getTokenPayLoad(data => {

        let userId = data.id;

        multerFile(req, res, () => {

            let data = JSON.parse(JSON.stringify(req.body)),
                groupId = data?.groupId,
                receiverId = data?.receiverId;

            if (isUndefined(groupId))
                return Json.builder(Response.HTTP_BAD_REQUEST);

            if (!isUndefined(receiverId))
                delete data?.receiverId;

            delete data?.groupId;

            validationGroupAndUserAndJoinedInGroup(groupId, userId, () => {

                Util.validateMessage(data, result => {

                    if (result === (IN_VALID_OBJECT_KEY || IN_VALID_MESSAGE_TYPE))
                        return Json.builder(Response.HTTP_INVALID_JSON_OBJECT_KEY);


                    let file = req.file;

                    data['senderId'] = userId;
                    if (isUndefined(file))
                        return Json.builder(Response.HTTP_BAD_REQUEST);

                    let {
                        fileUrl,
                        fileSize
                    } = File.validationAndWriteFile(file.buffer, getFileFormat(file.originalname));

                    data['fileUrl'] = fileUrl;
                    data['fileSize'] = fileSize;
                    data['fileName'] = file.originalname;


                    CommonInsert.message('`' + groupId + 'GroupContents`', data, {
                        conversationType: 'Group'
                    }, result => {
                        Json.builder(Response.HTTP_CREATED, {
                            insertId: result
                        });
                    });

                });

            });

        });

    });


};


exports.deleteGroup = (req) => {


    let id = req.params?.id;

    if (isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {

        let userId = data.id;

        validationGroupAndUserAndOwnerUser(id, userId, () => {

            Delete.group(id);
            Delete.groupAdmins(id);
            Delete.groupUsers(id);
            DeleteInUser.groupInListOfUserGroups(id);

        });

    });

}


exports.changeName = (req) => {

    let bodyObject = req.body,
        name = bodyObject?.name,
        id = bodyObject?.id;

    if (isUndefined(name) || isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {

        let userId = data.id;

        validationGroupAndUserAndOwnerUser(id, userId, () => {

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

        validationGroupAndUserAndOwnerUser(id, userId, () => {

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


            validationGroupAndUserAndOwnerUser(id, userId, () => {

                let file = req.file;

                if (isUndefined(file))
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


        validationGroupAndUserAndOwnerUser(id, userId, () => {

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


        validationGroupAndUserAndOwnerUser(id, userId, () => {

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


        validationGroupAndUserAndOwnerUser(id, userId, () => {

            let getUserId = isUndefined(targetUserId) ? userId : targetUserId;

            Insert.userIntoGroup(id, getUserId);
            InsertInUser.groupIntoListOfUserGroups(id, getUserId);

            Json.builder(Response.HTTP_CREATED);
        });

    });

}


exports.addAdmin = (req) => {

    let bodyObject = req.body,
        id = bodyObject?.id,
        userIdForNewAdmin = bodyObject?.userId;

    if (isUndefined(userIdForNewAdmin) || isUndefined(id))
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {


        let userId = data.id;

        validationGroupAndUser(id, userId, () => {

            isExistAndIsOwnerOfGroup(userIdForNewAdmin, userId, id, () => {

                Find.isJoinedInGroup(id, userIdForNewAdmin, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_NOT_FOUND);

                    Find.isUserAdminOfGroup(id, userIdForNewAdmin, result => {

                        if (result)
                            return Json.builder(Response.HTTP_CONFLICT);

                        let isNotOwner = 0;
                        Insert.userIntoGroupAdmins(userIdForNewAdmin, id, isNotOwner);


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

        validationGroupAndUser(id, userId, () => {

            isExistAndIsOwnerOfGroup(userIdForDeleteAdmin, userId, id, () => {

                Find.isUserAdminOfGroup(id, userIdForDeleteAdmin, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_NOT_FOUND);

                    Delete.userIntoGroupAdmins(id, userIdForDeleteAdmin);


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


        validationGroupAndUserAndJoinedInGroup(id, userId, () => {

            Delete.userIntoGroup(id, userId);
            DeleteInUser.groupIntoListOfUserGroups(id, userId);


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

        FindInUser.getTableNameForListOfUserGroups(id, userId, result => {

            if (!result)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);


            Find.getCountOfListMessage(id, count => {

                let totalPages = Math.ceil(count / getLimit);

                FindInUser.getListOfMessage('`' + id + 'GroupContents`', startFrom, getLimit, getOrder, getSort, type, search, result => {

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


        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);


            Find.getGroupInfo(id, result => {

                Find.getCountOfUserInGroup(id, count => {

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

    getTokenPayLoad(() => {


        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);


            Find.getAllUsersForGroup(id, data => {

                if (isUndefined(data))
                    return Json.builder(Response.HTTP_NOT_FOUND);

                FindInUser.getUserDetailsInUsersTableForMember(data, result => {

                    Json.builder(Response.HTTP_OK, result);

                });

            });

        });


    });

}