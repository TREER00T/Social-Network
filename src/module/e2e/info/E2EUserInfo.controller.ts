import { Controller, Get } from '@nestjs/common';
import { E2EUserInfoService } from './E2EUserInfo.service';

@Controller()
export class E2EUserInfoController {
  constructor(private readonly appService: E2EUserInfoService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
