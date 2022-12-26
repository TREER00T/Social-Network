import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupNameService {
  getHello(): string {
    return 'Hello World!';
  }
}
