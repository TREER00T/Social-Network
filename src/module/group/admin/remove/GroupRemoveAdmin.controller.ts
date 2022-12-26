import { Controller, Get } from '@nestjs/common';
import { GroupRemoveAdminService } from './GroupRemoveAdmin.service';

@Controller()
export class GroupRemoveAdminController {
  constructor(private readonly appService: GroupRemoveAdminService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
