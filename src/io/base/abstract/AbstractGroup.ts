import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {AbstractRoom} from "./AbstractRoom";

let Find = require("../../../model/find/group");

export class AbstractGroup extends AbstractRoom {

    async isGroupExist(roomId: string) {
        let isExist = await Find.id(roomId);

        if (!isExist)
            return Json.builder(Response.HTTP_NOT_FOUND);
    }

    async isUserJoined(roomId: string, userId: string) {
        let isJoined = await Find.isJoined(roomId, userId);

        if (!isJoined)
            return Json.builder(Response.HTTP_NOT_FOUND);
    }

}