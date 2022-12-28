import {Controller, Put} from '@nestjs/common';
import {GroupNameService} from './GroupName.service';

@Controller()
export class GroupNameController {
    constructor(private readonly appService: GroupNameService) {
    }

    @Put()
    async update() {

    }
}
