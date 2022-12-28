import {Controller, Delete, Post} from '@nestjs/common';
import {GroupAdminService} from './GroupAdmin.service';

@Controller()
export class GroupAdminController {
    constructor(private readonly appService: GroupAdminService) {
    }

    @Post("/add")
    async addAdmin() {

    }

    @Delete("/remove")
    async removeAdmin() {

    }
}
