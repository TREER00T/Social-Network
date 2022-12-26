import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelUsersService {
  getHello(): string {
    return 'Hello World!';
  }
}
