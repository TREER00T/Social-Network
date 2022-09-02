let Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    {
        isUndefined
    } = require('app/util/Util'),
    Find = require('app/model/find/common/common');


exports.search = (req) => {


    let value = req.query?.v;


    Find.searchWithNameInTableUsersGroupsAndChannels(value, result => {

        if (isUndefined(result))
            return Json.builder(Response.HTTP_NOT_FOUND);

        Json.builder(Response.HTTP_OK, result);

    });

}