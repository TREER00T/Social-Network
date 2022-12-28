import {Controller, Get} from '@nestjs/common';
import {PersonalUserBlocksService} from './PersonalUserBlocks.service';
import {UserTokenManager} from "../../base/UserTokenManager";
import Util from "../../../util/Util";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class PersonalUserBlocksController extends UserTokenManager {
    constructor(private readonly appService: PersonalUserBlocksService) {
        super();
    }

    @Get()
    async listOfUserBlocks() {
        await this.init();

        let listOfBlockedUsers = await this.appService.listOfBlockedUsers(this.userId);

        if (Util.isUndefined(listOfBlockedUsers))
            return Json.builder(Response.HTTP_NOT_FOUND);

        Json.builder(Response.HTTP_OK,
            await this.appService.userDetails(listOfBlockedUsers));
    }
}
