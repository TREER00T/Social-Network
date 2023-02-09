import {Body, Controller, Delete, Get, Post, Query} from '@nestjs/common';
import {ChannelAdminService} from './ChannelAdmin.service';
import {Channel} from "../../base/Channel";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import PromiseVerify from "../../base/PromiseVerify";

@Controller()
export class ChannelAdminController extends Channel {
    constructor(private readonly appService: ChannelAdminService) {
        super();
    }

    @Get()
    async listOfAdmin(@Query("channelId") channelId: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.verifyUser(this.userId),
            this.isChannelExist(channelId),
            this.isUserJoined(channelId),
            this.isOwnerOrAdmin(channelId)
        ]);

        if (haveErr)
            return haveErr;

        return Json.builder(Response.HTTP_OK, await this.userDetails(await this.appService.listOfAdmin(channelId)));
    }

    @Get("haveAccess")
    async userAccessResource(@Query("channelId") channelId: string) {
        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.verifyUser(this.userId),
            this.isChannelExist(channelId),
            this.isUserJoined(channelId)
        ]);

        if (haveErr)
            return haveErr;

        if (await this.isAdmin(channelId, this.userId))
            return Json.builder(Response.HTTP_ACCESS_RESOURCE_ADMIN);

        if (await this.isOwner(channelId))
            return Json.builder(Response.HTTP_ACCESS_RESOURCE_OWNER);

        return Json.builder(Response.HTTP_FORBIDDEN);
    }

    @Post()
    async addAdmin(@Body("channelId") channelId: string, @Body("targetUserId") targetUserId: string) {
        let haveErr = await this.determineAccess(channelId, targetUserId);

        if (haveErr)
            return haveErr;

        let isAdmin = await this.isAdmin(channelId, targetUserId);

        if (isAdmin)
            return Json.builder(Response.HTTP_CONFLICT);

        await this.appService.addAdmin(channelId, targetUserId);

        return Json.builder(Response.HTTP_OK);
    }

    @Delete()
    async removeAdmin(@Body("channelId") channelId: string, @Body("targetUserId") targetUserId: string) {
        let haveErr = await this.determineAccess(channelId, targetUserId);

        if (haveErr)
            return haveErr;

        let isAdmin = await this.isAdmin(channelId, targetUserId);

        if (!isAdmin)
            return Json.builder(Response.HTTP_CONFLICT);

        await this.appService.removeAdmin(channelId, targetUserId);

        return Json.builder(Response.HTTP_OK);
    }

    async determineAccess(channelId: string, targetUserId: string) {
        await this.init();

        return await PromiseVerify.all([
            this.isUndefined(targetUserId),
            this.isUndefined(channelId),
            this.isChannelExist(channelId),
            this.verifyUser(targetUserId),
            this.verifyUser(this.userId),
            this.isOwner(channelId),
            this.isUserJoined(channelId),
            this.isUserJoined(channelId, targetUserId)
        ]);
    }
}
