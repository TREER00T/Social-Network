import { Controller, Get } from '@nestjs/common';
import { GroupInfoService } from './GroupInfo.service';

@Controller()
export class GroupInfoController {
  constructor(private readonly appService: GroupInfoService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
