import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelInfoService {
  getHello(): string {
    return 'Hello World!';
  }
}
