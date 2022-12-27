import {Controller, Get} from '@nestjs/common';
import {PersonalUserInfoService} from './PersonalUserInfo.service';
import {UserTokenManager} from "../../base/UserTokenManager";
import Json from '../../../util/ReturnJson';
import Response from '../../../util/Response';

@Controller()
export class PersonalUserInfoController extends UserTokenManager {
    constructor(private readonly appService: PersonalUserInfoService) {
        super();
    }

    @Get()
    async userInfo() {
        await this.init();

        Json.builder(Response.HTTP_OK, await this.appService.userInfo(this.userId));
    }
}
