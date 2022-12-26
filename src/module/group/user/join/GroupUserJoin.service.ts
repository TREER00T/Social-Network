import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupUserJoinService {
  getHello(): string {
    return 'Hello World!';
  }
}
