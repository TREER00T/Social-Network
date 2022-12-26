import { Controller, Get } from '@nestjs/common';
import { GroupInviteLinkService } from './GroupInviteLink.service';

@Controller()
export class GroupInviteLinkController {
  constructor(private readonly appService: GroupInviteLinkService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
