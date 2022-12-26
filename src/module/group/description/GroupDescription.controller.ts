import { Controller, Get } from '@nestjs/common';
import { GroupDescriptionService } from './GroupDescription.service';

@Controller()
export class GroupDescriptionController {
  constructor(private readonly appService: GroupDescriptionService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
