import {Controller, Get, Query} from '@nestjs/common';
import {GroupInfoService} from './GroupInfo.service';
import {Group} from "../../base/Group";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import PromiseVerify from "../../base/PromiseVerify";
import {GroupLinkDto} from "../../base/dto/GroupLink.dto";

@Controller()
export class GroupInfoController extends Group {
    constructor(private readonly appService: GroupInfoService) {
        super();
    }

    @Get()
    async groupInfo(@Query() dto: GroupLinkDto) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.handleRoomId(dto)
        ]);

        if (haveErr?.statusCode)
            return haveErr;

        let isExist = await this.isGroupExist(haveErr);
        if (isExist?.statusCode)
            return isExist;

        return Json.builder(Response.HTTP_OK,
            await this.appService.groupInfo(isExist, await this.isOwnerOrAdmin(isExist)), {
                memberSize: await this.appService.countOfUsersInGroup(isExist)
            });
    }
}
