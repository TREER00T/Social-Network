import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupChatsService {
  getHello(): string {
    return 'Hello World!';
  }
}
