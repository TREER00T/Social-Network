import { Controller, Get } from '@nestjs/common';
import { E2ECreateRoomService } from './E2ECreateRoom.service';

@Controller()
export class E2ECreateRoomController {
  constructor(private readonly appService: E2ECreateRoomService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
