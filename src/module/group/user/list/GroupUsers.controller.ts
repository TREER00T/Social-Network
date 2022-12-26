import { Controller, Get } from '@nestjs/common';
import { GroupUsersService } from './GroupUsers.service';

@Controller()
export class GroupUsersController {
  constructor(private readonly appService: GroupUsersService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
