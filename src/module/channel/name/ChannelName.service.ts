import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelNameService {
  getHello(): string {
    return 'Hello World!';
  }
}
