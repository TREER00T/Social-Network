import {Controller, Get} from '@nestjs/common';
import {ChannelChatsService} from './ChannelChats.service';

@Controller()
export class ChannelChatsController {
    constructor(private readonly appService: ChannelChatsService) {
    }

    @Get()
    async listOfChat() {

    }
}
