import {Controller, Get, Query} from '@nestjs/common';
import {ChannelInfoService} from './ChannelInfo.service';
import {Channel} from "../../base/Channel";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import PromiseVerify from "../../base/PromiseVerify";
import {ChannelLinkDto} from "../../base/dto/ChannelLink.dto";

@Controller()
export class ChannelInfoController extends Channel {
    constructor(private readonly appService: ChannelInfoService) {
        super();
    }

    @Get()
    async channelInfo(@Query() dto: ChannelLinkDto) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.handleRoomId(dto)
        ]);

        if (haveErr?.statusCode)
            return haveErr;

        let isExist = await this.isChannelExist(haveErr);
        if (isExist?.statusCode)
            return isExist;

        return Json.builder(Response.HTTP_OK,
            await this.appService.channelInfo(isExist, !(await this.isOwnerOrAdmin(isExist))), {
                memberSize: await this.appService.countOfUsersInChannel(isExist)
            });
    }
}
