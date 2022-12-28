import {Controller, Put} from '@nestjs/common';
import {GroupLinkService} from './GroupLink.service';

@Controller()
export class GroupLinkController {
    constructor(private readonly appService: GroupLinkService) {
    }

    @Put("/invite")
    async invite() {

    }

    @Put("/public")
    async public() {

    }
}
