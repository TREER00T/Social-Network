import {Controller, Get, Query} from '@nestjs/common';
import {RoomsService} from "./Rooms.service";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import {User} from "../../base/User";
import Util from "../../../util/Util";

@Controller()
export class RoomsController extends User {

    constructor(private readonly appService: RoomsService) {
        super();
    }

    @Get()
    async userActivities(@Query("type") type: string) {
        await this.init();

        type = type?.toLowerCase();

        let typeChats = ['group', 'channel', 'e2e', 'all'],
            isValidType = typeChats.includes(type);

        if (!isValidType && !Util.isUndefined(type))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        if (type === 'all' || Util.isUndefined(type))
            return Json.builder(Response.HTTP_OK, await this.appService.getAllActivity(this.userId));

        return Json.builder(Response.HTTP_OK, await this.appService.listOfUserActivity(this.userId, type));
    }

}