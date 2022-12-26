import { Controller, Get } from '@nestjs/common';
import { GroupUploadAvatarService } from './GroupUploadAvatar.service';

@Controller()
export class GroupUploadAvatarController {
  constructor(private readonly appService: GroupUploadAvatarService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
