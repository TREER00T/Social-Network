import {Controller, Put} from '@nestjs/common';
import {GroupDescriptionService} from './GroupDescription.service';

@Controller()
export class GroupDescriptionController {
    constructor(private readonly appService: GroupDescriptionService) {
    }

    @Put()
    async update() {

    }
}
