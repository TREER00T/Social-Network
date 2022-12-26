import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonalBioService {
  getHello(): string {
    return 'Hello World!';
  }
}
