import { Controller, Get } from '@nestjs/common';
import { ChannelUserJoinService } from './ChannelUserJoin.service';

@Controller()
export class ChannelUserJoinController {
  constructor(private readonly appService: ChannelUserJoinService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
