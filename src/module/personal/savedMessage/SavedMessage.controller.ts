import { Controller, Get } from '@nestjs/common';
import { SavedMessageService } from './SavedMessage.service';

@Controller()
export class SavedMessageController {
  constructor(private readonly appService: SavedMessageService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
