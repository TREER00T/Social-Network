import {Body, Controller, Get} from '@nestjs/common';
import {ChannelChatsService} from './ChannelChats.service';
import Util from "../../../util/Util";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {DataQuery} from "../../base/dto/DataQuery";
import {Channel} from "../../base/Channel";

@Controller()
export class ChannelChatsController extends Channel {
    constructor(private readonly appService: ChannelChatsService) {
        super();
    }

    @Get()
    async listOfChat(@Body() dto: DataQuery) {
        await this.init();

        if (Util.isUndefined(dto?.roomId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let hasFoundChannelNameInListOfUserChannels = await this
            .appService.getChannelNameFromListOfUserChannels(dto.roomId, this.userId);

        if (!hasFoundChannelNameInListOfUserChannels)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        return await this.getListOfMessageFromRoom(dto,
            `${hasFoundChannelNameInListOfUserChannels}ChannelContents`);
    }
}
