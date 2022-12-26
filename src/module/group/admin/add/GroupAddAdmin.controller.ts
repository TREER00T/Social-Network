import { Controller, Get } from '@nestjs/common';
import { GroupAddAdminService } from './GroupAddAdmin.service';

@Controller()
export class GroupAddAdminController {
  constructor(private readonly appService: GroupAddAdminService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
