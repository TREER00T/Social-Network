let Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    Find = require('app/model/find/common/common');


exports.search = (req) => {


    let value = req.query.v;


    Find.searchWithNameInTableUsersGroupsAndChannels(value, result => {

        if (result === null)
            return Json.builder(Response.HTTP_NOT_FOUND);

        return Json.builder(Response.HTTP_OK, result);

    });

}