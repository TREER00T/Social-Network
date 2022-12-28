import {Controller, Get} from '@nestjs/common';
import {GroupChatsService} from './GroupChats.service';

@Controller()
export class GroupChatsController {
    constructor(private readonly appService: GroupChatsService) {
    }

    @Get()
    async listOfChat() {

    }
}
