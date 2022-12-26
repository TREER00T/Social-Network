import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateChannelService {
  getHello(): string {
    return 'Hello World!';
  }
}
