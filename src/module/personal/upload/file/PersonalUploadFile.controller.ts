import { Controller, Get } from '@nestjs/common';
import { PersonalUploadFileService } from './PersonalUploadFile.service';

@Controller()
export class PersonalUploadFileController {
  constructor(private readonly appService: PersonalUploadFileService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
