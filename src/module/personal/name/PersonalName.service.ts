import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonalNameService {
  getHello(): string {
    return 'Hello World!';
  }
}
