import { Controller, Get } from '@nestjs/common';
import { CreateChannelService } from './CreateChannel.service';

@Controller()
export class CreateChannelController {
  constructor(private readonly appService: CreateChannelService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
