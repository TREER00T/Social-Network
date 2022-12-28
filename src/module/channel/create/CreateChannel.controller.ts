import {Controller, Post} from '@nestjs/common';
import {CreateChannelService} from './CreateChannel.service';

@Controller()
export class CreateChannelController {
    constructor(private readonly appService: CreateChannelService) {
    }

    @Post()
    async createChannel() {

    }
}
