import {Body, Controller, Post} from '@nestjs/common';
import {E2ECreateRoomService} from './E2ECreateRoom.service';
import {User} from "../../base/User";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";


@Controller()
export class E2ECreateRoomController extends User {
    constructor(private readonly appService: E2ECreateRoomService) {
        super();
    }

    @Post()
    async createRoom(@Body("targetUserId") targetUserId: string) {
        this.init();

        let haveErr = await this.verifyUser(targetUserId);

        if (haveErr)
            return haveErr;

        await this.appService.initializationRoom(targetUserId, this.userId);

        return Json.builder(Response.HTTP_CREATED);
    }
}
