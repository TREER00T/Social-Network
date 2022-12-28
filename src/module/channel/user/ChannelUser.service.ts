import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelUserService {
  getHello(): string {
    return 'Hello World!';
  }
}
