import {Controller, Get} from '@nestjs/common';
import {ChannelChatsService} from './ChannelChats.service';
import Util from "../../../util/Util";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import OptionQuerySearch from "../../../util/OptionQuerySearch";
import {DataQuery} from "../../base/dto/DataQuery";
import {Channel} from "../../base/Channel";

@Controller()
export class ChannelChatsController extends Channel {
    constructor(private readonly appService: ChannelChatsService) {
        super();
        this.init();
    }

    @Get()
    async listOfChat(dto: DataQuery) {
        if (Util.isUndefined(dto?.roomId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let hasFoundChannelNameInListOfUserChannels = await this.appService.getChannelNameFromListOfUserChannels(dto.roomId, this.userId);

        if (!hasFoundChannelNameInListOfUserChannels)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        let query = OptionQuerySearch.build(dto);

        let totalPages = await this.getListOfMessageCount(`${hasFoundChannelNameInListOfUserChannels}ChannelContents`, query.limit);

        let listOfMessage = await this.getListOfMessage(`${hasFoundChannelNameInListOfUserChannels}ChannelContents`, query);

        return Json.builder(
            Response.HTTP_OK,
            listOfMessage, {
                totalPages: totalPages
            }
        );
    }
}
