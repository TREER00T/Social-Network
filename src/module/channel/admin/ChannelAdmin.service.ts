import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelAdminService {
  getHello(): string {
    return 'Hello World!';
  }
}
