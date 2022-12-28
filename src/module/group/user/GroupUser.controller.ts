import {Controller, Delete, Get, Post} from '@nestjs/common';
import {GroupUsersService} from './GroupUsers.service';

@Controller()
export class GroupUserController {
    constructor(private readonly appService: GroupUsersService) {
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
