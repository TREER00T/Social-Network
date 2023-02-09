import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import {User} from "./User";
import PromiseVerify from "./PromiseVerify";
import Find from "../../model/find/channel";
import Util from "../../util/Util";
import {ChannelLinkDto} from "./dto/ChannelLink.dto";
import {RoomId} from "../../util/Types";

export abstract class Channel extends User {

    async handleRoomId(dto: ChannelLinkDto) {
        let data = {};

        if (!Util.isUndefined(dto?.channelId))
            data = {type: 'channelId', id: dto.channelId};

        if (!Util.isUndefined(dto?.publicLink))
            data = {type: 'publicLink', id: dto.publicLink};

        if (!Util.isUndefined(dto?.inviteLink))
            data = {type: 'inviteLink', id: dto.inviteLink};

        if (Util.isUndefined(dto?.channelId) && Util.isUndefined(dto?.inviteLink) && Util.isUndefined(dto?.publicLink))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        return data;
    }

    async isOwnerOrAdmin(channelId: string) {
        let isOwnerOrAdmin = await Find.isOwnerOrAdmin(channelId, this.userId);

        if (!isOwnerOrAdmin)
            return Json.builder(Response.HTTP_FORBIDDEN);
    }

    async isOwner(roomId: string) {
        let isOwner = await PromiseVerify.all([
            this.isChannelExist(roomId),
            this.verifyUser(this.userId),
            Find.isOwner(this.userId, roomId)
        ]);

        if (typeof isOwner !== "boolean")
            return isOwner;

        if (!isOwner)
            return Json.builder(Response.HTTP_FORBIDDEN);
    }

    async isChannelExist(roomId: string | RoomId) {
        let isExist = await Find.id(roomId);

        if (!isExist)
            return Json.builder(Response.HTTP_NOT_FOUND);

        return isExist;
    }

    async isUserJoined(roomId: string, userId: string = this.userId) {
        let isJoined = await Find.isJoined(roomId, userId);

        if (!isJoined)
            return Json.builder(Response.HTTP_NOT_FOUND);
    }

    async isNotJoinedUser(roomId: string, userId: string = this.userId) {
        return await Find.isJoined(roomId, userId);
    }

    async isAdmin(channelId: string, targetUserId: string) {
        return await Find.isAdmin(channelId, targetUserId);
    }

}