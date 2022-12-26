import { Controller, Get } from '@nestjs/common';
import { ChannelUploadFileService } from './ChannelUploadFile.service';

@Controller()
export class ChannelUploadFileController {
  constructor(private readonly appService: ChannelUploadFileService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
