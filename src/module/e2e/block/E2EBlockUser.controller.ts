import {Body, Controller, Put} from '@nestjs/common';
import {E2EBlockUserService} from './E2EBlockUser.service';
import {User} from "../../base/User";
import Util from "../../../util/Util";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";

@Controller()
export class E2EBlockUserController extends User {
    constructor(private readonly appService: E2EBlockUserService) {
        super();
    }

    @Put()
    async handleUserBlockState(@Body("targetUserId") targetUserId: string) {
        await this.init();

        this.verifyUser(targetUserId).then(async () => {

            let hasUserBlocked = await this.appService.hasUserBlocked(this.userId, targetUserId);

            if (!hasUserBlocked)
                await this.appService.enableBlockUser(this.userId, targetUserId);
            else
                await this.appService.disableBlockUser(this.userId, targetUserId);

            return Json.builder(Response.HTTP_OK);

        });
    }
}
