import { Controller, Get } from '@nestjs/common';
import { PersonalUserBlocksService } from './PersonalUserBlocks.service';

@Controller()
export class PersonalUserBlocksController {
  constructor(private readonly appService: PersonalUserBlocksService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
