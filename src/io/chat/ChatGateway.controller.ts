import { Controller, Get } from '@nestjs/common';
import { ChatGatewayService } from './ChatGateway.service';

@Controller()
export class ChatGatewayController {
  constructor(private readonly appService: ChatGatewayService) {}

  @Get()
  getHello(): string {
    return 'Hello';
  }
}
