import { Controller, Get } from '@nestjs/common';
import { ChannelRemoveAdminService } from './ChannelRemoveAdmin.service';

@Controller()
export class ChannelRemoveAdminController {
  constructor(private readonly appService: ChannelRemoveAdminService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
