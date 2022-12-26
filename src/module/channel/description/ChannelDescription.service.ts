import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelDescriptionService {
  getHello(): string {
    return 'Hello World!';
  }
}
