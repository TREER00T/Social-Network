import {Controller, Get, Query} from '@nestjs/common';
import {GroupChatsService} from './GroupChats.service';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {Group} from "../../base/Group";
import {RoomDataQuery} from "../../base/dto/RoomDataQuery";

@Controller()
export class GroupChatsController extends Group {
    constructor(private readonly appService: GroupChatsService) {
        super();
    }

    @Get()
    async listOfChat(@Query() dto: RoomDataQuery) {
        await this.init();

        let hasFoundGroupNameInListOfUserGroups = await this
            .appService.getGroupNameFromListOfUserGroups(dto.roomId, this.userId);

        if (!hasFoundGroupNameInListOfUserGroups)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        return await this.getListOfMessageFromRoom(dto,
            `${hasFoundGroupNameInListOfUserGroups}GroupContents`);
    }
}
