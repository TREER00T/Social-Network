import {Body, Controller, Get} from '@nestjs/common';
import {GroupInfoService} from './GroupInfo.service';
import {Channel} from "../../base/Channel";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import PromiseVerify from "../../base/PromiseVerify";

@Controller()
export class GroupInfoController extends Channel {
    constructor(private readonly appService: GroupInfoService) {
        super();
    }

    @Get()
    async channelInfo(@Body("channelId") channelId: string) {
        this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.isChannelExist(channelId)
        ]);

        if (haveErr)
            return haveErr;

        return Json.builder(Response.HTTP_OK,
            await this.appService.groupInfo(channelId), {
                memberSize: await this.appService.countOfUsersInGroup(channelId)
            });
    }
}
