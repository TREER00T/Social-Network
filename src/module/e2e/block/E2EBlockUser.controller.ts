import {Body, Controller, Put} from '@nestjs/common';
import {E2EBlockUserService} from './E2EBlockUser.service';
import {User} from "../../base/User";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";

@Controller()
export class E2EBlockUserController extends User {
    constructor(private readonly appService: E2EBlockUserService) {
        super();
    }

    @Put()
    async handleUserBlockState(@Body("targetUserId") targetUserId: string) {
        this.init();

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
