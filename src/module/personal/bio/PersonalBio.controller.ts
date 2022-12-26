import { Controller, Get } from '@nestjs/common';
import { PersonalBioService } from './PersonalBio.service';

@Controller()
export class PersonalBioController {
  constructor(private readonly appService: PersonalBioService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
