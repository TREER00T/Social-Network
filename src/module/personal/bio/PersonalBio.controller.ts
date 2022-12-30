import {Controller, Put, Body} from '@nestjs/common';
import {PersonalBioService} from './PersonalBio.service';
import {User} from "../../base/User";
import Util from "../../../util/Util";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class PersonalBioController extends User {
    constructor(private readonly appService: PersonalBioService) {
        super();
        this.init();
    }

    @Put()
    async updateBio(@Body("bio") bio: string) {
        if (Util.isUndefined(bio))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        await this.appService.updateBio(this.phoneNumber, bio);

        Json.builder(Response.HTTP_OK);
    }
}
