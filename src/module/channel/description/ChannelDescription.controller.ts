import { Controller, Get } from '@nestjs/common';
import { ChannelDescriptionService } from './ChannelDescription.service';

@Controller()
export class ChannelDescriptionController {
  constructor(private readonly appService: ChannelDescriptionService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
