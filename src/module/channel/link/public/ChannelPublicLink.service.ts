import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelPublicLinkService {
  getHello(): string {
    return 'Hello World!';
  }
}
