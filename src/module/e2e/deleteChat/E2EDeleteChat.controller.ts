import { Controller, Get } from '@nestjs/common';
import { E2EDeleteChatService } from './E2EDeleteChat.service';

@Controller()
export class E2EDeleteChatController {
  constructor(private readonly appService: E2EDeleteChatService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
