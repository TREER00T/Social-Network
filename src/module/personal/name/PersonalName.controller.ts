import { Controller, Get } from '@nestjs/common';
import { PersonalNameService } from './PersonalName.service';

@Controller()
export class PersonalNameController {
  constructor(private readonly appService: PersonalNameService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
