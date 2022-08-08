let Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    multer = require('multer'),
    Insert = require('app/model/add/insert/groups/group'),
    InsertInUser = require('app/model/add/insert/user/users'),
    Create = require('app/model/create/groups'),
    Find = require('app/model/find/groups/group'),
    FindInUser = require('app/model/find/user/users'),
    Delete = require('app/model/remove/groups/group'),
    Update = require('app/model/update/groups/group'),
    AddGroupForeignKey = require('app/model/add/foreignKey/groups'),
    DeleteInUser = require('app/model/remove/users/user'),
    multerImage = multer().single('image'),
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

            let name = req.body?.name;
            let isUndefinedName = (name === undefined);

            if (isUndefinedName)
                return Json.builder(Response.HTTP_BAD_REQUEST);

            let file = req.file;
            let fileUrl;
            let isOwner = 1;


            if (file !== undefined) {
                fileUrl = File.validationAndWriteFile(file.buffer, Util.getFileFormat(file.originalname)).fileUrl;
            }

            Insert.group(name.toString().trim(), Generate.makeIdForInviteLink(), Util.getRandomHexColor(), fileUrl, id => {

                if (id === null)
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                Create.groupContents(id);
                AddGroupForeignKey.groupContents(id);
                Insert.userIntoGroupAdmins(userId, id, isOwner);
                Insert.userIntoGroup(userId, id);

                return Json.builder(Response.HTTP_CREATED);
            });

        });

    });


}


exports.deleteGroup = (req) => {


    let id = req.params?.id;


    getTokenPayLoad(data => {

        let userId = data.id;

        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                Find.isOwnerOfGroup(userId, id, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_FORBIDDEN);

                    Delete.group(id);
                    Delete.groupAdmins(id);
                    Delete.groupUsers(id);
                    DeleteInUser.groupInListOfUserGroups(id);
                });

            });

        });

    });

}


exports.changeName = (req) => {

    let {id, name} = req.body;

    if (name < 1 || name === undefined)
        return Json.builder(Response.HTTP_BAD_REQUEST);

    getTokenPayLoad(data => {

        let userId = data.id;

        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                Find.isOwnerOfGroup(userId, id, result => {

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

        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                Find.isOwnerOfGroup(userId, id, result => {

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


            Find.groupId(id, isDefined => {

                if (!isDefined)
                    return Json.builder(Response.HTTP_NOT_FOUND);

                FindInUser.isExistUser(userId, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_USER_NOT_FOUND);

                    Find.isOwnerOfGroup(userId, id, result => {

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

        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                Find.isOwnerOfGroup(userId, id, result => {

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

        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                Find.isOwnerOfGroup(userId, id, result => {

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

        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                Find.isJoinedInGroup(id, userId, result => {

                    if (result)
                        return Json.builder(Response.HTTP_CONFLICT);

                    Insert.userIntoGroup(id, userId);
                    InsertInUser.groupIntoListOfUserGroups(id, userId);


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

        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                FindInUser.isExistUser(userIdForNewAdmin, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_USER_NOT_FOUND);


                    Find.isOwnerOfGroup(userId, id, result => {

                        if (!result)
                            return Json.builder(Response.HTTP_FORBIDDEN);

                        Find.isJoinedInGroup(id, userIdForNewAdmin, result => {

                            if (!result)
                                return Json.builder(Response.HTTP_NOT_FOUND);

                            Find.isUserAdminOfGroup(id, userIdForNewAdmin, result => {

                                if (result)
                                    return Json.builder(Response.HTTP_CONFLICT);

                                let isNotOwner = 0;
                                Insert.userIntoGroupAdmins(userIdForNewAdmin, id, isNotOwner);


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

        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                FindInUser.isExistUser(userIdForDeleteAdmin, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_USER_NOT_FOUND);


                    Find.isOwnerOfGroup(userId, id, result => {

                        if (!result)
                            return Json.builder(Response.HTTP_FORBIDDEN);


                        Find.isUserAdminOfGroup(id, userIdForDeleteAdmin, result => {

                            if (!result)
                                return Json.builder(Response.HTTP_NOT_FOUND);

                            Delete.userIntoGroupAdmins(id, userIdForDeleteAdmin);


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

        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);

                Find.isJoinedInGroup(id, userId, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_NOT_FOUND);

                    Delete.userIntoGroup(id, userId);
                    DeleteInUser.groupIntoListOfUserGroups(id, userId);


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

        FindInUser.getTableNameForListOfUserGroups(id, userId, result => {

            if (!result)
                return Json.builder(Response.HTTP_USER_NOT_FOUND);


            Find.getCountOfListMessage(id, count => {

                let totalPages = Math.ceil(count / getLimit);

                FindInUser.getListOfMessage('`' + id + 'GroupContents`', startFrom, getLimit, getOrder, getSort, type, search, result => {

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


        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);


            Find.getGroupInfo(id, result => {

                Find.getCountOfUserInGroup(id, count => {

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


    getTokenPayLoad(() => {


        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);


            Find.getAllUsersForGroup(id, data => {

                if (data === null)
                    return Json.builder(Response.HTTP_NOT_FOUND);

                FindInUser.getUserDetailsInUsersTableForMember(data, result => {

                    return Json.builder(Response.HTTP_OK, result);

                });

            });

        });


    });

}