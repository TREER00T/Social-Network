import {Controller, Delete, Param} from '@nestjs/common';
import {DeleteChannelService} from './DeleteChannel.service';
import {Channel} from "../../base/Channel";
import Util from "../../../util/Util";
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";


@Controller()
export class DeleteChannelController extends Channel {

    constructor(private readonly appService: DeleteChannelService) {
        super();
    }

    @Delete()
    async removeChannel(@Param("channelId") channelId: string) {
        await this.init();

        if (Util.isUndefined(channelId))
            return Json.builder(Response.HTTP_BAD_REQUEST);

        this.isOwner(channelId)
            .then(async () => this.appService.removeChannel(channelId))
            .then(() => Json.builder(Response.HTTP_OK));
    }

}
