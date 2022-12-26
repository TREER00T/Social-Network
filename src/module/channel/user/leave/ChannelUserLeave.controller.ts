import { Controller, Get } from '@nestjs/common';
import { ChannelUserLeaveService } from './ChannelUserLeave.service';

@Controller()
export class ChannelUserLeaveController {
  constructor(private readonly appService: ChannelUserLeaveService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
