import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import Util from "../../util/Util";
import {HandleMessage} from "./HandleMessage";

let Find = require("../../model/find/user");

export abstract class User extends HandleMessage {

    userId: string;
    phoneNumber: string;

    async init() {
        let tokenPayload = await Util.getTokenPayLoad();
        this.userId = tokenPayload.id;
        this.phoneNumber = tokenPayload.phone;
    }

    async verifyUser(userId) {
        this.isUndefined(userId)
            .then(async () => {
                let isUserExist = await Find.isExist(userId);

                if (!isUserExist)
                    return Json.builder(Response.HTTP_USER_NOT_FOUND);
            });
    }

}