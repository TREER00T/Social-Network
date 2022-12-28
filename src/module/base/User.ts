import {UserTokenManager} from "./UserTokenManager";
import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import Util from "../../util/Util";

let Find = require("../../model/find/user");

export abstract class User extends UserTokenManager {

    async verifyUser(userId) {
        if (Util.isUndefined(userId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isUserExist = await Find.isExist(userId);

        if (!isUserExist)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);
    }

}