import { Controller, Get } from '@nestjs/common';
import { RefreshTokenService } from './RefreshToken.service';

@Controller()
export class RefreshTokenController {
  constructor(private readonly appService: RefreshTokenService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
