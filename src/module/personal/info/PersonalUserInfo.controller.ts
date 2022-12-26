import { Controller, Get } from '@nestjs/common';
import { PersonalUserInfoService } from './PersonalUserInfo.service';

@Controller()
export class PersonalUserInfoController {
  constructor(private readonly appService: PersonalUserInfoService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
