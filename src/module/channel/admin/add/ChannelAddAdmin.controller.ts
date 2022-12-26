import { Controller, Get } from '@nestjs/common';
import { ChannelAddAdminService } from './ChannelAddAdmin.service';

@Controller()
export class ChannelAddAdminController {
  constructor(private readonly appService: ChannelAddAdminService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
