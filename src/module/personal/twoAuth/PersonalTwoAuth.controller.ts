import { Controller, Get } from '@nestjs/common';
import { PersonalTwoAuthService } from './PersonalTwoAuth.service';

@Controller()
export class PersonalTwoAuthController {
  constructor(private readonly appService: PersonalTwoAuthService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
