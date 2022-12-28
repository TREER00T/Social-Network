import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupLinkService {
  getHello(): string {
    return 'Hello World!';
  }
}
