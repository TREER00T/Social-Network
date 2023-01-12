import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {AbstractRoom} from "./AbstractRoom";
import Find from "../../../model/find/channel";

export class AbstractChannel extends AbstractRoom {

    async isChannelExist(roomId: string) {
        let isExist = await Find.id(roomId);

        if (!isExist)
            return Json.builder(Response.HTTP_NOT_FOUND);
    }

    async isUserJoined(roomId: string, userId: string) {
        let isJoined = await Find.isJoined(roomId, userId);

        if (!isJoined)
            return Json.builder(Response.HTTP_NOT_FOUND);
    }

    async isOwnerOrAdmin(channelId: string, userId: string) {
        let isOwnerOrAdmin = await Find.isOwnerOrAdmin(channelId, userId);

        if (!isOwnerOrAdmin)
            return Json.builder(Response.HTTP_FORBIDDEN);
    }

}