import {Controller, Delete, Post} from '@nestjs/common';
import {ChannelAdminService} from './ChannelAdmin.service';

@Controller()
export class ChannelAdminController {
    constructor(private readonly appService: ChannelAdminService) {
    }

    @Post("/add")
    async addAdmin() {

    }

    @Delete("/remove")
    async removeAdmin() {

    }
}
