import { Controller, Get } from '@nestjs/common';
import { ChannelLinkService } from './ChannelLink.service';

@Controller()
export class ChannelLinkController {
  constructor(private readonly appService: ChannelLinkService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
