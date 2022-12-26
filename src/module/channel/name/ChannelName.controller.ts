import { Controller, Get } from '@nestjs/common';
import { ChannelNameService } from './ChannelName.service';

@Controller()
export class ChannelNameController {
  constructor(private readonly appService: ChannelNameService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
