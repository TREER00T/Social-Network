import {Body, Controller, Post, Put} from '@nestjs/common';
import {E2EBlockUserService} from './E2EBlockUser.service';
import {UserTokenManager} from "../../base/UserTokenManager";
import Util from "../../../util/Util";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";

@Controller()
export class E2EBlockUserController extends UserTokenManager {
    constructor(private readonly appService: E2EBlockUserService) {
        super();
    }
    @Put()
    async handleUserBlockState(@Body("targetUserId") targetUserId: string) {
        await this.init();

        if (Util.isUndefined(targetUserId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isUserExist = await this.appService.isExistUser(this.userId);

        if (!isUserExist)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        let hasUserBlocked = await this.appService.hasUserBlocked(this.userId, targetUserId);

        if (!hasUserBlocked)
            await this.appService.enableBlockUser(this.userId, targetUserId);
        else
            await this.appService.disableBlockUser(this.userId, targetUserId);

        return Json.builder(Response.HTTP_OK);
    }
}
