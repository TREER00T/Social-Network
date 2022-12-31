import {Controller, Get} from '@nestjs/common';
import {PersonalUserInfoService} from './PersonalUserInfo.service';
import {User} from "../../base/User";
import Json from '../../../util/ReturnJson';
import Response from '../../../util/Response';

@Controller()
export class PersonalUserInfoController extends User {
    constructor(private readonly appService: PersonalUserInfoService) {
        super();
    }

    @Get()
    async userInfo() {
        this.init();

        return Json.builder(Response.HTTP_OK, await this.appService.userInfo(this.userId));
    }
}
