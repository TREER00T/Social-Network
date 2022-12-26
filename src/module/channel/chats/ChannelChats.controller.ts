import { Controller, Get } from '@nestjs/common';
import { ChannelChatsService } from './ChannelChats.service';

@Controller()
export class ChannelChatsController {
  constructor(private readonly appService: ChannelChatsService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
