import { Controller, Get } from '@nestjs/common';
import { GroupUploadFileService } from './GroupUploadFile.service';

@Controller()
export class GroupUploadFileController {
  constructor(private readonly appService: GroupUploadFileService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
