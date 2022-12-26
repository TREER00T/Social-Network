import { Controller, Get } from '@nestjs/common';
import { ChannelUsersService } from './ChannelUsers.service';

@Controller()
export class ChannelUsersController {
  constructor(private readonly appService: ChannelUsersService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
