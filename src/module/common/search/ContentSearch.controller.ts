import { Controller, Get } from '@nestjs/common';
import { ContentSearchService } from './ContentSearch.service';

@Controller()
export class ContentSearchController {
  constructor(private readonly appService: ContentSearchService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
