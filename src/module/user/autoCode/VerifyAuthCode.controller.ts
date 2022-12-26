import { Controller, Get } from '@nestjs/common';
import { VerifyAuthCodeService } from './VerifyAuthCode.service';

@Controller()
export class VerifyAuthCodeController {
  constructor(private readonly appService: VerifyAuthCodeService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
