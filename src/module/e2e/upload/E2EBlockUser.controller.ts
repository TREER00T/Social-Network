import { Controller, Get } from '@nestjs/common';
import { E2EBlockUserService } from './E2EBlockUser.service';

@Controller()
export class E2EBlockUserController {
  constructor(private readonly appService: E2EBlockUserService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
