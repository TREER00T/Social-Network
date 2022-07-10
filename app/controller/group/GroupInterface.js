let Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    multer = require('multer'),
    Insert = require('app/model/add/insert/groups/group'),
    Create = require('app/model/create/groups'),
    Find = require('app/model/find/groups/group'),
    FindInUser = require('app/model/find/user/users'),
    Delete = require('app/model/remove/groups/group'),
    Update = require('app/model/update/groups/group'),
    DeleteInUser = require('app/model/remove/users/user'),
    multerImage = multer().single('image'),
    {
        getAccessTokenPayLoad
    } = require('app/middleware/ApiPipeline'),
    File = require('app/util/File'),
    Util = require('app/util/Util'),
    Generate = require('app/util/Generate');


exports.create = (req, res) => {


    let name = req.body.name;
    let isUndefinedName = (name === undefined);

    if (isUndefinedName)
        return Json.builder(Response.HTTP_BAD_REQUEST);


    getAccessTokenPayLoad(data => {

        let userId = data.id;

        multerImage(req, res, () => {

            let file = req.file;
            let fileUrl;
            let isOwner = 1;

            if (file !== undefined) {
                fileUrl = File.validationAndWriteFile(file.buffer, Util.getFileFormat(file.originalname)).fileUrl;
            }

            Insert.group(name.toString().trim(), Generate.makeId(), Util.getRandomHexColor(), fileUrl, id => {

                if (id === null)
                    return Json.builder(Response.HTTP_BAD_REQUEST);

                Create.groupContents(id);
                Insert.groupAdmin(userId, id, isOwner);
                Insert.groupIdInListOfUserGroup(userId, id);

                return Json.builder(Response.HTTP_CREATED);
            });

        });

    });


}


exports.deleteGroup = (req) => {


    let id = req.params.id;


    getAccessTokenPayLoad(data => {

        let userId = data.id;

        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_User_NOT_FOUND);

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



exports.uploadAvatar = (req, res) => {

    let id = req.body.id;

    getAccessTokenPayLoad(data => {

        let userId = data.id;

        Find.groupId(id, isDefined => {

            if (!isDefined)
                return Json.builder(Response.HTTP_NOT_FOUND);

            FindInUser.isExistUser(userId, result => {

                if (!result)
                    return Json.builder(Response.HTTP_User_NOT_FOUND);

                Find.isOwnerOfGroup(userId, id, result => {

                    if (!result)
                        return Json.builder(Response.HTTP_FORBIDDEN);

                    multerImage(req, res, () => {

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
