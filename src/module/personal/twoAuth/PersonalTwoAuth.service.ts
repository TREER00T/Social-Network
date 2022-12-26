import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonalTwoAuthService {
  getHello(): string {
    return 'Hello World!';
  }
}
