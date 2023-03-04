import {Body, Controller, Get, Put, Query} from '@nestjs/common';
import {E2EBlockUserService} from './E2EBlockUser.service';
import {User} from "../../base/User";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";

@Controller()
export class E2EBlockUserController extends User {
    constructor(private readonly appService: E2EBlockUserService) {
        super();
    }

    @Get()
    async hasUserBlock(@Query("targetUserId") targetUserId: string) {
        await this.init();

        let haveErr = await this.verifyUser(targetUserId);

        if (haveErr)
            return haveErr;

        let hasBlockedByMe = await this.appService.hasBlockedByUser(this.userId, targetUserId);

        if (hasBlockedByMe)
            return Json.builder(Response.HTTP_OK_BUT_TARGET_USER_ID_BLOCKED_BY_ME);

        let hasMeBlockedByTargetUserId = await this.appService.hasBlockedByUser(targetUserId, this.userId);

        if (hasMeBlockedByTargetUserId)
            return Json.builder(Response.HTTP_OK_BUT_ME_BLOCKED_BY_TARGET_USER_ID);

        return Json.builder(Response.HTTP_NOT_FOUND);
    }

    @Put()
    async handleUserBlockState(@Body("targetUserId") targetUserId: string) {
        await this.init();

        let haveErr = await this.verifyUser(targetUserId);

        if (haveErr)
            return haveErr;

        let hasUserBlocked = await this.appService.hasUserBlocked(this.userId, targetUserId);

        if (!hasUserBlocked)
            await this.appService.enableBlockUser(this.userId, targetUserId);
        else
            await this.appService.disableBlockUser(this.userId, targetUserId);

        return Json.builder(Response.HTTP_OK);
    }
}
