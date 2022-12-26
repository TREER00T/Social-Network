import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupInfoService {
  getHello(): string {
    return 'Hello World!';
  }
}
