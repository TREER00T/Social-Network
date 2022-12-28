import {Controller, Get, Query} from '@nestjs/common';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import OptionQuerySearch from "../../../util/OptionQuerySearch";
import {DataQuery} from "../../base/dto/DataQuery";
import Util from "../../../util/Util";
import {E2EMessage} from "../../base/E2EMessage";

@Controller()
export class E2EChatsController extends E2EMessage {
    constructor() {
        super();
    }

    @Get()
    async allChats(@Query() dto: DataQuery) {
        await this.init();

        if (Util.isUndefined(dto?.to))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        this.getNameOfE2EChat(dto.to).then(async e2eChatName => {

            let query = OptionQuerySearch.build(dto);

            let totalPages = await this.getListOfMessageCount(e2eChatName, query.limit);

            let listOfMessage = await this.getListOfMessage(e2eChatName, query);

            return Json.builder(
                Response.HTTP_OK,
                listOfMessage, {
                    totalPages: totalPages
                }
            );

        });
    }
}
