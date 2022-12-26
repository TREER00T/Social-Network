import { Controller, Get } from '@nestjs/common';
import { DeleteChannelService } from './DeleteChannel.service';

@Controller()
export class DeleteChannelController {
  constructor(private readonly appService: DeleteChannelService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
