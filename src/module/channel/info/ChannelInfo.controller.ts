import { Controller, Get } from '@nestjs/common';
import { ChannelInfoService } from './ChannelInfo.service';

@Controller()
export class ChannelInfoController {
  constructor(private readonly appService: ChannelInfoService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
