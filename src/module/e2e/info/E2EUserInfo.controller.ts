import {Controller, Get, Query} from '@nestjs/common';
import {E2EUserInfoService} from './E2EUserInfo.service';
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import {User} from "../../base/User";
import {UserIdDto} from "./UserId.dto";

@Controller()
export class E2EUserInfoController extends User {
    constructor(private readonly appService: E2EUserInfoService) {
        super();
    }

    @Get()
    async userInfo(@Query() dto: UserIdDto) {
        await this.init();

        let userId = await this.handleUserId(dto);

        if (userId?.statusCode)
            return userId;

        let haveErr = await this.verifyUser(userId);

        if (haveErr)
            return haveErr;

        // Like username , img ...
        let userPvDetails = await this.appService.userInfo(userId);

        return Json.builder(Response.HTTP_OK, userPvDetails);
    }
}
