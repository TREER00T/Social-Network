import {Body, Controller, Put} from '@nestjs/common';
import {ChannelNameService} from './ChannelName.service';
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import {Channel} from "../../base/Channel";

@Controller()
export class ChannelNameController extends Channel {
    constructor(private readonly appService: ChannelNameService) {
        super();
        this.init();
    }

    @Put()
    async update(@Body("channelId") channelId: string, @Body("name") name: string) {
        this.isUndefined(channelId)
            .then(() => this.isUndefined(name))
            .then(() => this.isOwner(channelId))
            .then(async () => {

                await this.appService.updateName(name, channelId);

                Json.builder(Response.HTTP_OK);

            });
    }
}
