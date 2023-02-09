import {User} from "./User";
import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import PromiseVerify from "./PromiseVerify";
import Find from "../../model/find/group";
import Util from "../../util/Util";
import {GroupLinkDto} from "./dto/GroupLink.dto";
import {RoomId} from "../../util/Types";

export abstract class Group extends User {

    async handleRoomId(dto: GroupLinkDto) {
        let data = {};

        if (!Util.isUndefined(dto?.groupId))
            data = {type: 'groupId', id: dto.groupId};

        if (!Util.isUndefined(dto?.publicLink))
            data = {type: 'publicLink', id: dto.publicLink};

        if (!Util.isUndefined(dto?.inviteLink))
            data = {type: 'inviteLink', id: dto.inviteLink};

        if (Util.isUndefined(dto?.groupId) && Util.isUndefined(dto?.inviteLink) && Util.isUndefined(dto?.publicLink))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        return data;
    }

    async isGroupExist(roomId: string | RoomId) {
        let isExist = await Find.id(roomId);

        if (!isExist)
            return Json.builder(Response.HTTP_NOT_FOUND);

        return isExist;
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

    async isOwnerOrAdmin(groupId: string) {
        return await Find.isOwnerOrAdmin(groupId, this.userId);
    }

}