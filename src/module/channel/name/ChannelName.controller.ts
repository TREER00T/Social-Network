import {Controller, Put} from '@nestjs/common';
import {ChannelNameService} from './ChannelName.service';

@Controller()
export class ChannelNameController {
    constructor(private readonly appService: ChannelNameService) {
    }

    @Put()
    async update() {

    }
}
