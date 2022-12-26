import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelChatsService {
  getHello(): string {
    return 'Hello World!';
  }
}
