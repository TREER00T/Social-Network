import { Controller, Get } from '@nestjs/common';
import { E2EUploadFileService } from './E2EUploadFile.service';

@Controller()
export class E2EUploadFileController {
  constructor(private readonly appService: E2EUploadFileService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
