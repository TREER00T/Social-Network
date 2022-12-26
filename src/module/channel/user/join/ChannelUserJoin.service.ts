import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelUserJoinService {
  getHello(): string {
    return 'Hello World!';
  }
}
