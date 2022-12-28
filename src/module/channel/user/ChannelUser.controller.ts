import { Controller, Get } from '@nestjs/common';
import { ChannelUserService } from './ChannelUser.service';

@Controller()
export class ChannelUserController {
  constructor(private readonly appService: ChannelUserService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
