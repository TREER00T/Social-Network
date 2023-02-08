import {Body, Controller, Delete, Param, Post} from '@nestjs/common';
import {E2EService} from './E2E.service';
import Json from "../../util/ReturnJson";
import Response from "../../util/Response";
import PromiseVerify from "../base/PromiseVerify";
import {E2EMessage} from "../base/E2EMessage";


@Controller()
export class E2EController extends E2EMessage {
    constructor(private readonly appService: E2EService) {
        super();
    }

    @Post()
    async createRoom(@Body("targetUserId") targetUserId: string) {
        await this.init();

        let haveErr = await this.verifyUser(targetUserId);

        if (haveErr)
            return haveErr;

        await this.appService.initializationRoom(targetUserId, this.userId);

        return Json.builder(Response.HTTP_CREATED);
    }

    @Delete("/:targetUserId/us")
    async deleteChatForUs(@Param("targetUserId") targetUserId: string, @Body("roomId") roomId: string) {
        let haveErr = await PromiseVerify.all([
            this.isUndefined(roomId),
            this.validation(targetUserId)
        ]);

        if (haveErr)
            return haveErr;

        await this.appService.deleteChatForUs(roomId, this.userId, targetUserId);

        return Json.builder(Response.HTTP_OK);
    }

    @Delete("/:targetUserId/me")
    async deleteChatForMe(@Param("targetUserId") targetUserId: string) {
        let haveErr = await this.validation(targetUserId);

        if (haveErr)
            return haveErr;

        await this.appService.deleteChatForMe(this.userId, targetUserId);

        return Json.builder(Response.HTTP_OK);
    }

    async validation(targetUserId: string): Promise<any> {
        await this.init();

        return await PromiseVerify.all([
            this.verifyUser(targetUserId)
        ]);
    }
}
