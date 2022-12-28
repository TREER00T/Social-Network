import {Controller, Delete, Get, Post} from '@nestjs/common';
import {ChannelUserService} from './ChannelUser.service';

@Controller()
export class ChannelUserController {
    constructor(private readonly appService: ChannelUserService) {
    }

    @Get("/all")
    async listOfUsers() {

    }

    @Post("/join")
    async joinUser() {

    }

    @Delete("/leave")
    async leaveUser() {

    }
}
