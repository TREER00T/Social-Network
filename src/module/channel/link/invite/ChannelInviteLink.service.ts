import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelInviteLinkService {
  getHello(): string {
    return 'Hello World!';
  }
}
