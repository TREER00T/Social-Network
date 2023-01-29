import {Body, Controller, Get} from '@nestjs/common';
import {GroupInfoService} from './GroupInfo.service';
import {Group} from "../../base/Group";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import PromiseVerify from "../../base/PromiseVerify";

@Controller()
export class GroupInfoController extends Group {
    constructor(private readonly appService: GroupInfoService) {
        super();
    }

    @Get()
    async groupInfo(@Body("groupId") groupId: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(groupId),
            this.isGroupExist(groupId)
        ]);

        if (haveErr)
            return haveErr;

        return Json.builder(Response.HTTP_OK,
            await this.appService.groupInfo(groupId), {
                memberSize: await this.appService.countOfUsersInGroup(groupId)
            });
    }
}
