import {Controller, Param, Put} from '@nestjs/common';
import {PersonalUsernameService} from './PersonalUsername.service';
import {User} from "../../base/User";
import Util from "../../../util/Util";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";

@Controller()
export class PersonalUsernameController extends User {
    constructor(private readonly appService: PersonalUsernameService) {
        super();
    }

    @Put("/:username")
    async updateUsername(@Param("username") username: string) {
        await this.init();

        if (Util.isUndefined(username))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isExistUsername = await this.appService.isExistUsername(username);

        if (isExistUsername)
            return Json.builder(Response.HTTP_CONFLICT);

        let hasUpdate = this.appService.updateUsername(this.phoneNumber, username);

        if (!hasUpdate)
            return Json.builder(Response.HTTP_BAD_REQUEST);

        return Json.builder(Response.HTTP_OK);
    }
}
