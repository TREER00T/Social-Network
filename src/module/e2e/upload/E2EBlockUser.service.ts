import { Injectable } from '@nestjs/common';

@Injectable()
export class E2EBlockUserService {
  getHello(): string {
    return 'Hello World!';
  }
}
