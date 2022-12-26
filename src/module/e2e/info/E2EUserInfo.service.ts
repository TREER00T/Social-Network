import { Injectable } from '@nestjs/common';

@Injectable()
export class E2EUserInfoService {
  getHello(): string {
    return 'Hello World!';
  }
}
