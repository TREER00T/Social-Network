import {Controller, Delete, Param} from '@nestjs/common';
import {E2EDeleteChatService} from './E2EDeleteChat.service';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {E2EMessage} from "../../base/E2EMessage";


@Controller()
export class E2EDeleteChatController extends E2EMessage {
    constructor(private readonly appService: E2EDeleteChatService) {
        super();
    }

    @Delete("/:id/us")
    async deleteChatForUs(@Param("id") targetUserId: string) {

        this.validation(targetUserId).then(async e2eChatName => {

            await this.appService.deleteChatForUs(e2eChatName, this.userId, targetUserId);

            return Json.builder(Response.HTTP_OK);

        });

    }

    @Delete("/:id/me")
    async deleteChatForMe(@Param("id") targetUserId: string) {

        this.validation(targetUserId).then(async () => {

            await this.appService.deleteChatForMe(this.userId, targetUserId);

            return Json.builder(Response.HTTP_OK);

        });

    }

    async validation(targetUserId: string): Promise<any> {
        await this.init();

        let e2eChatName = await this.verifyUser(targetUserId)
            .then(async () => await this.getNameOfE2EChat(targetUserId));

        if (typeof e2eChatName !== "string")
            return Json.builder(Response.HTTP_BAD_REQUEST);

        return e2eChatName;
    }
}
