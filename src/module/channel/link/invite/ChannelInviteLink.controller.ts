import { Controller, Get } from '@nestjs/common';
import { ChannelInviteLinkService } from './ChannelInviteLink.service';

@Controller()
export class ChannelInviteLinkController {
  constructor(private readonly appService: ChannelInviteLinkService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
