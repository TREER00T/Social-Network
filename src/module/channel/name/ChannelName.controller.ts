import {Body, Controller, Put} from '@nestjs/common';
import {ChannelNameService} from './ChannelName.service';
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import {Channel} from "../../base/Channel";
import PromiseVerify from "../../base/PromiseVerify";

@Controller()
export class ChannelNameController extends Channel {
    constructor(private readonly appService: ChannelNameService) {
        super();
    }

    @Put()
    async update(@Body("channelId") channelId: string, @Body("name") name: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.isUndefined(name),
            this.isOwner(channelId)
        ]);

        if (haveErr)
            return haveErr;

        await this.appService.updateName(name, channelId);

        return Json.builder(Response.HTTP_OK);
    }
}
