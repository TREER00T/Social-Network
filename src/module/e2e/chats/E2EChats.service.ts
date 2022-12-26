import { Injectable } from '@nestjs/common';

@Injectable()
export class E2EChatsService {
  getHello(): string {
    return 'Hello World!';
  }
}
