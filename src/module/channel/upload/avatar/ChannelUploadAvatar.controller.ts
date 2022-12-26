import { Controller, Get } from '@nestjs/common';
import { ChannelUploadAvatarService } from './ChannelUploadAvatar.service';

@Controller()
export class ChannelUploadAvatarController {
  constructor(private readonly appService: ChannelUploadAvatarService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
