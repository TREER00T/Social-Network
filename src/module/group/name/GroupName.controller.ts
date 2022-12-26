import { Controller, Get } from '@nestjs/common';
import { GroupNameService } from './GroupName.service';

@Controller()
export class GroupNameController {
  constructor(private readonly appService: GroupNameService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
