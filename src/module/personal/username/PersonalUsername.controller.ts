import { Controller, Get } from '@nestjs/common';
import { PersonalUsernameService } from './PersonalUsername.service';

@Controller()
export class PersonalUsernameController {
  constructor(private readonly appService: PersonalUsernameService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
