import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonalUserBlocksService {
  getHello(): string {
    return 'Hello World!';
  }
}
