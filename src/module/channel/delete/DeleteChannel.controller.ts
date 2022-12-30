import {Controller, Delete, Param} from '@nestjs/common';
import {DeleteChannelService} from './DeleteChannel.service';
import {Channel} from "../../base/Channel";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";


@Controller()
export class DeleteChannelController extends Channel {

    constructor(private readonly appService: DeleteChannelService) {
        super();
        this.init();
    }

    @Delete()
    async removeChannel(@Param("channelId") channelId: string) {
        this.isUndefined(channelId)
            .then(() => this.isOwner(channelId))
            .then(() => this.appService.removeChannel(channelId));

        return Json.builder(Response.HTTP_OK);
    }

}
