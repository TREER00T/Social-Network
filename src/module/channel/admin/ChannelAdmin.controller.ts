import { Controller, Get } from '@nestjs/common';
import { ChannelAdminService } from './ChannelAdmin.service';

@Controller()
export class ChannelAdminController {
  constructor(private readonly appService: ChannelAdminService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
