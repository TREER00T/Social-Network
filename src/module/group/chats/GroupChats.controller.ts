import {Body, Controller, Get} from '@nestjs/common';
import {GroupChatsService} from './GroupChats.service';
import Util from "../../../util/Util";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {DataQuery} from "../../base/dto/DataQuery";
import {Group} from "../../base/Group";

@Controller()
export class GroupChatsController extends Group {
    constructor(private readonly appService: GroupChatsService) {
        super();
    }

    @Get()
    async listOfChat(@Body() dto: DataQuery) {
        await this.init();

        if (Util.isUndefined(dto?.roomId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        let hasFoundGroupNameInListOfUserGroups = await this
            .appService.getGroupNameFromListOfUserGroups(dto.roomId, this.userId);

        if (!hasFoundGroupNameInListOfUserGroups)
            return Json.builder(Response.HTTP_USER_NOT_FOUND);

        return await this.getListOfMessageFromRoom(dto,
            `${hasFoundGroupNameInListOfUserGroups}GroupContents`);
    }
}
