let Json = require('../../util/ReturnJson'),
    Response = require('../../util/Response'),
    {
        isUndefined
    } = require('../../util/Util'),
    Find = require('../../model/find/common/common');


exports.search = async (req) => {


    let value = req.query?.v;


    let result = await Find.searchWithNameInTableUsersGroupsAndChannels(value);

    if (isUndefined(result))
        return Json.builder(Response.HTTP_NOT_FOUND);

    Json.builder(Response.HTTP_OK, result);


}