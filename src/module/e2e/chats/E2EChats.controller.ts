import { Controller, Get } from '@nestjs/common';
import { E2EChatsService } from './E2EChats.service';

@Controller()
export class E2EChatsController {
  constructor(private readonly appService: E2EChatsService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
