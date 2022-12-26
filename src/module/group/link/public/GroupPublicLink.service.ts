import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupPublicLinkService {
  getHello(): string {
    return 'Hello World!';
  }
}
