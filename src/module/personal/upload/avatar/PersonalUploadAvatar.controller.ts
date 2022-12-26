import { Controller, Get } from '@nestjs/common';
import { PersonalUploadAvatarService } from './PersonalUploadAvatar.service';

@Controller()
export class PersonalUploadAvatarController {
  constructor(private readonly appService: PersonalUploadAvatarService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
