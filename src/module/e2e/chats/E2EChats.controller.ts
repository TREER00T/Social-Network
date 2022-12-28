import {Controller, Get, Query} from '@nestjs/common';
import {E2EChatsService} from './E2EChats.service';
import {UserTokenManager} from "../../base/UserTokenManager";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {PersonalAccount} from "../../personal/message/PersonalMessage.service";
import OptionQuerySearch from "../../../util/OptionQuerySearch";
import {DataQuery} from "../../base/dto/DataQuery";
import Util from "../../../util/Util";

@Controller()
export class E2EChatsController extends UserTokenManager {
    constructor(private readonly appService: E2EChatsService,
                private readonly personalAccountService: PersonalAccount) {
        super();
    }

    @Get()
    async allChats(@Query() dto: DataQuery) {
        await this.init();

        if (Util.isUndefined(dto?.to))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let e2eTableChatName = await this.appService.getTableNameFrom2EChat(this.userId, dto.to);

        if (!e2eTableChatName)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        let query = OptionQuerySearch.build(dto);

        let totalPages = await this.personalAccountService.listOfMessageCount(e2eTableChatName, query.limit);

        let listOfMessage = await this.personalAccountService.listOfMessage(e2eTableChatName, query);

        return Json.builder(
            Response.HTTP_OK,
            listOfMessage, {
                totalPages: totalPages
            }
        );
    }
}
