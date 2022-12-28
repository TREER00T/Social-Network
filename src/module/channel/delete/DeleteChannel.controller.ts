import {Controller, Delete, Param} from '@nestjs/common';
import {DeleteChannelService} from './DeleteChannel.service';

@Controller()
export class DeleteChannelController {
    constructor(private readonly appService: DeleteChannelService) {
    }

    @Delete()
    async removeChannel(@Param("channelId") channelId: string) {

    }
}
