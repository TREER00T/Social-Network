import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelLinkService {
  getHello(): string {
    return 'Hello World!';
  }
}
