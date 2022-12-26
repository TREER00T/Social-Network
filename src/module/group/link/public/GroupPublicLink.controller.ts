import { Controller, Get } from '@nestjs/common';
import { GroupPublicLinkService } from './GroupPublicLink.service';

@Controller()
export class GroupPublicLinkController {
  constructor(private readonly appService: GroupPublicLinkService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
