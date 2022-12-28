import {Controller, Post} from '@nestjs/common';
import {CreateGroupService} from './CreateGroup.service';

@Controller()
export class CreateGroupController {
    constructor(private readonly appService: CreateGroupService) {
    }

    @Post()
    async createGroup() {

    }
}
