import { Controller, Get } from '@nestjs/common';
import { ChannelPublicLinkService } from './ChannelPublicLink.service';

@Controller()
export class ChannelPublicLinkController {
  constructor(private readonly appService: ChannelPublicLinkService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
