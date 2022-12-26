import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonalAccount {
  getHello(): string {
    return 'Hello World!';
  }
}
