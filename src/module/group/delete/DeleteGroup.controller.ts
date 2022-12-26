import { Controller, Get } from '@nestjs/common';
import { DeleteGroupService } from './DeleteGroup.service';

@Controller()
export class DeleteGroupController {
  constructor(private readonly appService: DeleteGroupService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
