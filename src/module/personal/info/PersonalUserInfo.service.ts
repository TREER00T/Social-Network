import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonalUserInfoService {
  getHello(): string {
    return 'Hello World!';
  }
}
