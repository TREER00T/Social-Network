import {Body, Controller, Put} from '@nestjs/common';
import {ChannelDescriptionService} from './ChannelDescription.service';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {Channel} from "../../base/Channel";
import PromiseVerify from "../../base/PromiseVerify";

@Controller()
export class ChannelDescriptionController extends Channel {
    constructor(private readonly appService: ChannelDescriptionService) {
        super();
    }

    @Put()
    async update(@Body("channelId") channelId: string, @Body("description") description: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(channelId),
            this.isUndefined(description),
            this.isOwner(channelId)
        ]);

        if (haveErr)
            return haveErr;

        await this.appService.updateDescription(description, channelId);

        return Json.builder(Response.HTTP_OK);
    }
}
