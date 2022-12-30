import {Body, Controller, Get} from '@nestjs/common';
import {ChannelInfoService} from './ChannelInfo.service';
import {Channel} from "../../base/Channel";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class ChannelInfoController extends Channel {
    constructor(private readonly appService: ChannelInfoService) {
        super();
        this.init();
    }

    @Get()
    async channelInfo(@Body("channelId") channelId: string) {
        this.isUndefined(channelId)
            .then(() => this.isChannelExist(channelId))
            .then(async () => {

                Json.builder(Response.HTTP_OK,
                    this.appService.channelInfo(channelId), {
                        memberSize: this.appService.countOfUsersInChannel(channelId)
                    });

            });
    }
}
