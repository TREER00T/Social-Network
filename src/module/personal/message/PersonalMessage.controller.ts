import { Controller, Get } from '@nestjs/common';
import { PersonalAccount } from './PersonalMessage.service';

@Controller()
export class PersonalMessageController {
  constructor(private readonly appService: PersonalAccount) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
