import {Controller, Get, Query} from '@nestjs/common';
import {ChannelChatsService} from './ChannelChats.service';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {Channel} from "../../base/Channel";
import {RoomDataQuery} from "../../base/dto/RoomDataQuery";

@Controller()
export class ChannelChatsController extends Channel {
    constructor(private readonly appService: ChannelChatsService) {
        super();
    }

    @Get()
    async listOfChat(@Query() dto: RoomDataQuery) {
        await this.init();

        let hasFoundChannelNameInListOfUserChannels = await this
            .appService.getChannelNameFromListOfUserChannels(dto.roomId, this.userId);

        if (!hasFoundChannelNameInListOfUserChannels)
            return Json.builder(Response.HTTP_NOT_FOUND);

        return await this.getListOfMessageFromRoom(dto,
            `${hasFoundChannelNameInListOfUserChannels}ChannelContents`);
    }
}
