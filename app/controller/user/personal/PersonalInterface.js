let Json = require('app/util/ReturnJson'),
    {
        getAccessTokenPayLoad
    } = require('app/middleware/ApiPipeline'),
    Response = require('app/util/Response'),
    Update = require('app/model/update/user/users'),
    Find = require('app/model/find/user/users');


exports.user = (req, res) => {


    Json.initializationRes(res);


    getAccessTokenPayLoad(data => {

        let userId = data.userId;

        Find.getPersonalUserDetails(userId, result => {

            return Json.builder(Response.HTTP_OK, result);
        });


    });


}


exports.editUsername = (req, res) => {

    Json.initializationRes(res);


    let username = req.params.id;

    if (username.toString().trim().length < 1)
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

    if (bio.toString().trim().length < 1)
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

    if (firstName.toString().trim().length < 1)
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