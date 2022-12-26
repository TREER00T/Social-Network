import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentSearchService {
  getHello(): string {
    return 'Hello World!';
  }
}
