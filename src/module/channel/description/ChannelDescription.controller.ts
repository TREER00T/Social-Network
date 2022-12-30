import {Body, Controller, Put} from '@nestjs/common';
import {ChannelDescriptionService} from './ChannelDescription.service';
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {Channel} from "../../base/Channel";

@Controller()
export class ChannelDescriptionController extends Channel {
    constructor(private readonly appService: ChannelDescriptionService) {
        super();
        this.init();
    }

    @Put()
    async update(@Body("channelId") channelId: string, @Body("description") description: string) {
        this.isUndefined(channelId)
            .then(() => this.isUndefined(description))
            .then(() => this.isOwner(channelId))
            .then(async () => {

                await this.appService.updateDescription(description, channelId);

                Json.builder(Response.HTTP_OK);

            });

    }
}
