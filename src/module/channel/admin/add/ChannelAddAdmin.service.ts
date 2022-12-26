import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelAddAdminService {
  getHello(): string {
    return 'Hello World!';
  }
}
