import {Controller, Get, Query} from '@nestjs/common';
import {E2EUserInfoService} from './E2EUserInfo.service';
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import {User} from "../../base/User";

@Controller()
export class E2EUserInfoController extends User {
    constructor(private readonly appService: E2EUserInfoService) {
        super();
    }

    @Get()
    async userInfo(@Query("userId") userId: string) {
        await this.init();

        let haveErr = await this.verifyUser(userId);

        if (haveErr)
            return haveErr;

        // Like username , img ...
        let userPvDetails = await this.appService.userInfo(userId);

        return Json.builder(Response.HTTP_OK, userPvDetails);
    }
}
