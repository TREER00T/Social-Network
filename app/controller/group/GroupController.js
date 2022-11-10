let Json = require('../../util/ReturnJson'),
    Response = require('../../util/Response'),
    multer = require('multer'),
    InsertInGroup = require('../../model/add/insert/groups/group'),
    InsertInUser = require('../../model/add/insert/user/users'),
    Create = require('../../model/create/groups'),
    FindInGroup = require('../../model/find/groups/group'),
    FindInUser = require('../../model/find/user/users'),
    DeleteInGroup = require('../../model/remove/groups/group'),
    CommonInsert = require('../../model/add/insert/common/index'),
    UpdateInGroup = require('../../model/update/groups/group'),
    AddGroupForeignKey = require('../../model/add/foreignKey/groups'),
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


let validationGroupAndUser = (roomId, userId, cb) => {

        FindInGroup.id(roomId, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExist(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                cb();
            });

        });

    },
    validationGroupAndUserAndOwnerUser = (roomId, userId, cb) => {

        validationGroupAndUser(roomId, userId, () => {

            FindInGroup.isOwner(userId, roomId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_FORBIDDEN);

                cb();
            });

        });

    },
    validationGroupAndUserAndJoinedInGroup = (roomId, userId, cb) => {

        validationGroupAndUser(roomId, userId, () => {

            FindInGroup.isJoined(roomId, userId, result => {

                if (result)
                    return Json.builder(Response.HTTP_NOT_FOUND);

                cb();
            });

        });

    },
    isExistAndIsOwnerOfGroup = (userIdForAdmin, userId, groupId, cb) => {

        FindInUser.isExist(userIdForAdmin, result => {

            if (!result)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);


            FindInGroup.isOwner(userId, groupId, result => {

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
                fileUrl = File.validationAndWriteFile({
                    size: file.size,
                    dataBinary: file.buffer,
                    format: getFileFormat(file.originalname)
                }).url;


            InsertInGroup.group(name.toString().trim(), Generate.makeIdForInviteLink(), getRandomHexColor(), fileUrl, id => {

                if (isUndefined(id))
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                Create.groupContents(id);
                AddGroupForeignKey.groupContents(id);
                InsertInGroup.admin(userId, id, isOwner);
                InsertInGroup.user(userId, id);

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

            DeleteInGroup.group(id);
            DeleteInGroup.groupAdmins(id);
            DeleteInGroup.groupUsers(id);
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

            UpdateInGroup.name(id, name.toString().trim(), result => {
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

            UpdateInGroup.description(id, description, result => {
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
                    url
                } = File.validationAndWriteFile({
                    size: file.size,
                    dataBinary: file.buffer,
                    format: getFileFormat(file.originalname)
                });

                UpdateInGroup.img(id, url, result => {
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
            UpdateInGroup.inviteLink(id, link, result => {
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

            FindInGroup.isPublicKeyUsed(publicLink, result => {
                if (!result)
                    return Json.builder(Response.HTTP_CONFLICT);

                UpdateInGroup.publicLink(id, publicLink, result => {
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

            InsertInGroup.user(id, getUserId);
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

                FindInGroup.isJoined(id, userIdForNewAdmin, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_NOT_FOUND);

                    FindInGroup.isAdmin(id, userIdForNewAdmin, result => {

                        if (result)
                            return Json.builder(Response.HTTP_CONFLICT);

                        let isNotOwner = 0;
                        InsertInGroup.admin(userIdForNewAdmin, id, isNotOwner);


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

                FindInGroup.isAdmin(id, userIdForDeleteAdmin, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_NOT_FOUND);

                    DeleteInGroup.admin(id, userIdForDeleteAdmin);


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

            DeleteInGroup.user(id, userId);
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


            FindInGroup.getCountOfListMessage(id, count => {

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


        FindInGroup.id(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);


            FindInGroup.getInfo(id, result => {

                FindInGroup.getCountOfUsers(id, count => {

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


        FindInGroup.id(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);


            FindInGroup.getAllUsers(id, data => {

                if (isUndefined(data))
                    return Json.builder(Response.HTTP_NOT_FOUND);

                FindInUser.getUserDetailsInUsersTableForMember(data, result => {

                    Json.builder(Response.HTTP_OK, result);

                });

            });

        });


    });

}