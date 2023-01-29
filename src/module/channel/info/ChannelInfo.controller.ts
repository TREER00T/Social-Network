import {Body, Controller, Get} from '@nestjs/common';
import {ChannelInfoService} from './ChannelInfo.service';
import {Channel} from "../../base/Channel";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import PromiseVerify from "../../base/PromiseVerify";

@Controller()
export class ChannelInfoController extends Channel {
    constructor(private readonly appService: ChannelInfoService) {
        super();
    }

    @Get()
    async channelInfo(@Body("channelId") channelId: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.isChannelExist(channelId)
        ]);

        if (haveErr)
            return haveErr;

        return Json.builder(Response.HTTP_OK,
            await this.appService.channelInfo(channelId), {
                memberSize: await this.appService.countOfUsersInChannel(channelId)
            });
    }
}
