import { Controller, Get } from '@nestjs/common';
import { CreateGroupService } from './CreateGroup.service';

@Controller()
export class CreateGroupController {
  constructor(private readonly appService: CreateGroupService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
