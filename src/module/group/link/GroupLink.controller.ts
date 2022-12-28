import { Controller, Get } from '@nestjs/common';
import { GroupLinkService } from './GroupLink.service';

@Controller()
export class GroupLinkController {
  constructor(private readonly appService: GroupLinkService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
