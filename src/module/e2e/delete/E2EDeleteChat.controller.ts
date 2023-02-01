import {Body, Controller, Delete, Param} from '@nestjs/common';
import {E2EDeleteChatService} from './E2EDeleteChat.service';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {E2EMessage} from "../../base/E2EMessage";
import PromiseVerify from "../../base/PromiseVerify";


@Controller()
export class E2EDeleteChatController extends E2EMessage {
    constructor(private readonly appService: E2EDeleteChatService) {
        super();
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
