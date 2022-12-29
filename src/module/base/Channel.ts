import {User} from "./User";

import Json from "../../util/ReturnJson";
import Response from "../../util/Response";

let Find = require("../../model/find/channel");

export abstract class Channel extends User {

    async isOwnerOrAdmin(channelId: string) {
        let isOwnerOrAdmin = await Find.isOwnerOrAdmin(channelId, this.userId);

        if (!isOwnerOrAdmin)
            return Json.builder(Response.HTTP_FORBIDDEN);
    }

    async isOwner(roomId: string) {
        let isOwner = await this.isChannelExist(roomId)
            .then(() => this.verifyUser(this.userId))
            .then(() => Find.isOwner(this.userId, roomId));

        if (!isOwner)
            return Json.builder(Response.HTTP_FORBIDDEN);
    }

    async isChannelExist(roomId: string) {
        let isExist = await Find.id(roomId);

        if (!isExist)
            return Json.builder(Response.HTTP_NOT_FOUND);
    }

}