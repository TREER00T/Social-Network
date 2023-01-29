import {User} from "./User";
import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import PromiseVerify from "./PromiseVerify";
import Find from "../../model/find/group";

export abstract class Group extends User {

    async isGroupExist(roomId: string) {
        let isExist = await Find.id(roomId);

        if (!isExist)
            return Json.builder(Response.HTTP_NOT_FOUND);
    }

    async isNotJoinedUser(roomId: string, userId: string = this.userId) {
        return await Find.isJoined(roomId, userId);
    }

    async isAdmin(groupId: string, targetUserId: string) {
        return await Find.isAdmin(groupId, targetUserId);
    }

    async isOwner(roomId: string) {
        let isOwner = await PromiseVerify.all([
            this.isGroupExist(roomId),
            this.verifyUser(this.userId),
            Find.isOwner(this.userId, roomId)
        ]);

        if (typeof isOwner !== 'string')
            return Json.builder(Response.HTTP_FORBIDDEN);
    }

    async isUserJoined(roomId: string, userId: string = this.userId) {
        let isJoined = await Find.isJoined(roomId, userId);

        if (!isJoined)
            return Json.builder(Response.HTTP_NOT_FOUND);
    }

}