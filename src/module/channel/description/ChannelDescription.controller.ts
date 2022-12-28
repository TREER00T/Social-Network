import {Controller, Put} from '@nestjs/common';
import {ChannelDescriptionService} from './ChannelDescription.service';

@Controller()
export class ChannelDescriptionController {
    constructor(private readonly appService: ChannelDescriptionService) {
    }

    @Put()
    async update() {

    }
}
