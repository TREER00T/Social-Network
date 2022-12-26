import { Controller, Get } from '@nestjs/common';
import { PersonalAccount } from './PersonalAccount.service';

@Controller()
export class PersonalAccountController {
  constructor(private readonly appService: PersonalAccount) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
