import {Body, Controller, Delete, Get, Post, Query} from '@nestjs/common';
import {GroupAdminService} from './GroupAdmin.service';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import PromiseVerify from "../../base/PromiseVerify";
import {Group} from "../../base/Group";

@Controller()
export class GroupAdminController extends Group {
    constructor(private readonly appService: GroupAdminService) {
        super();
    }

    @Get()
    async listOfAdmin(@Query("groupId") groupId: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(groupId),
            this.verifyUser(this.userId),
            this.isGroupExist(groupId),
            this.isUserJoined(groupId),
            this.isOwnerOrAdmin(groupId)
        ]);

        if (haveErr)
            return haveErr;

        return Json.builder(Response.HTTP_OK, await this.userDetails(await this.appService.listOfAdmin(groupId)));
    }

    @Get("haveAccess")
    async userAccessResource(@Query("groupId") groupId: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(groupId),
            this.verifyUser(this.userId),
            this.isGroupExist(groupId),
            this.isUserJoined(groupId)
        ]);

        if (haveErr)
            return haveErr;

        if (await this.isAdmin(groupId, this.userId))
            return Json.builder(Response.HTTP_ACCESS_RESOURCE_ADMIN);

        if (await this.isOwner(groupId))
            return Json.builder(Response.HTTP_ACCESS_RESOURCE_OWNER);

        return Json.builder(Response.HTTP_FORBIDDEN);
    }

    @Post()
    async addAdmin(@Body("groupId") groupId: string, @Body("targetUserId") targetUserId: string) {
        let haveErr = await this.determineAccess(groupId, targetUserId);

        if (haveErr)
            return haveErr;

        let isAdmin = await this.isAdmin(groupId, targetUserId);

        if (isAdmin)
            return Json.builder(Response.HTTP_CONFLICT);

        await this.appService.addAdmin(groupId, targetUserId);

        return Json.builder(Response.HTTP_OK);
    }

    @Delete()
    async removeAdmin(@Body("groupId") groupId: string, @Body("targetUserId") targetUserId: string) {
        let haveErr = await this.determineAccess(groupId, targetUserId);

        if (haveErr)
            return haveErr;

        let isAdmin = await this.isAdmin(groupId, targetUserId);

        if (!isAdmin)
            return Json.builder(Response.HTTP_CONFLICT);

        await this.appService.removeAdmin(groupId, targetUserId);

        return Json.builder(Response.HTTP_OK);
    }

    async determineAccess(groupId: string, targetUserId: string) {
        await this.init();

        return await PromiseVerify.all([
            this.isUndefined(targetUserId),
            this.isUndefined(groupId),
            this.isGroupExist(groupId),
            this.verifyUser(targetUserId),
            this.verifyUser(this.userId),
            this.isOwner(groupId),
            this.isUserJoined(groupId),
            this.isUserJoined(groupId, targetUserId)
        ]);
    }
}
