import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonalUsernameService {
  getHello(): string {
    return 'Hello World!';
  }
}
