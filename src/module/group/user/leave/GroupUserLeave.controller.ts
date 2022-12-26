import { Controller, Get } from '@nestjs/common';
import { GroupUserLeaveService } from './GroupUserLeave.service';

@Controller()
export class GroupUserLeaveController {
  constructor(private readonly appService: GroupUserLeaveService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
