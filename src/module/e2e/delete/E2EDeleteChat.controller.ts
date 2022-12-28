import {Controller, Delete, Param} from '@nestjs/common';
import {E2EDeleteChatService} from './E2EDeleteChat.service';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {E2EChatsService} from "../chats/E2EChats.service";
import {UserTokenManager} from "../../base/UserTokenManager";
import Util from "../../../util/Util";


@Controller()
export class E2EDeleteChatController extends UserTokenManager {
    constructor(private readonly appService: E2EDeleteChatService,
                private readonly e2eChatsService: E2EChatsService) {
        super();
    }

    @Delete("/:id/us")
    async deleteChatForUs(@Param("id") targetUserId: string) {
        let e2eChatName = await this.validation(targetUserId);

        if (typeof e2eChatName !== "string")
            return Json.builder(Response.HTTP_BAD_REQUEST);

        await this.appService.deleteChatForUs(e2eChatName, this.userId, targetUserId);

        return Json.builder(Response.HTTP_OK);
    }

    @Delete("/:id/me")
    async deleteChatForMe(@Param("id") targetUserId: string) {

        let e2eChatName = await this.validation(targetUserId);

        if (typeof e2eChatName !== "string")
            return Json.builder(Response.HTTP_BAD_REQUEST);

        await this.appService.deleteChatForMe(this.userId, targetUserId);

        return Json.builder(Response.HTTP_OK);
    }

    async validation(targetUserId: string) {
        await this.init();

        if (Util.isUndefined(targetUserId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let isUserExist = await this.appService.isUserExist(targetUserId);

        if (!isUserExist)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        let e2eChatName = await this.e2eChatsService.getTableNameFrom2EChat(this.userId, targetUserId);

        if (!e2eChatName)
            return Json.builder(Response.HTTP_NOT_FOUND);

        return e2eChatName;
    }
}
