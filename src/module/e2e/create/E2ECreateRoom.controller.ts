import {Body, Controller, Post} from '@nestjs/common';
import {E2ECreateRoomService} from './E2ECreateRoom.service';
import {UserTokenManager} from "../../base/UserTokenManager";
import Util from "../../../util/Util";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";


@Controller()
export class E2ECreateRoomController extends UserTokenManager {
    constructor(private readonly appService: E2ECreateRoomService) {
        super();
    }

    @Post()
    async createRoom(@Body("targetUserId") targetUserId: string) {
        await this.init();

        if (Util.isUndefined(targetUserId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isUserExist = await this.appService.isUserExist(targetUserId);

        if (!isUserExist)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        await this.appService.initializationRoom(targetUserId, this.userId);

        return Json.builder(Response.HTTP_CREATED);
    }
}
