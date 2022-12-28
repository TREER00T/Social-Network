import { Controller, Get } from '@nestjs/common';
import { GroupAdminService } from './GroupAdmin.service';

@Controller()
export class GroupAdminController {
  constructor(private readonly appService: GroupAdminService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
