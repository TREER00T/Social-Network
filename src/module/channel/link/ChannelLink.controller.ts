import {Controller, Put} from '@nestjs/common';
import {ChannelLinkService} from './ChannelLink.service';

@Controller()
export class ChannelLinkController {
    constructor(private readonly appService: ChannelLinkService) {
    }

    @Put("/invite")
    async invite() {

    }

    @Put("/public")
    async public() {

    }
}
