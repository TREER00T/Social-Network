import {Controller, Get, Query} from '@nestjs/common';
import {E2EUserInfoService} from './E2EUserInfo.service';
import Util from "../../../util/Util";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";

@Controller()
export class E2EUserInfoController {
    constructor(private readonly appService: E2EUserInfoService) {
    }

    @Get()
    async userInfo(@Query() userId: string) {
        if (Util.isUndefined(userId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isUserExist = this.appService.isUserExist(userId);

        if (!isUserExist)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        let userPvDetails = await this.appService.userInfo(userId);

        return Json.builder(Response.HTTP_OK, userPvDetails);
    }
}
