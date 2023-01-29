import {Body, Controller, Delete, Post} from '@nestjs/common';
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
