import { Controller, Get } from '@nestjs/common';
import { GroupUserJoinService } from './GroupUserJoin.service';

@Controller()
export class GroupUserJoinController {
  constructor(private readonly appService: GroupUserJoinService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
