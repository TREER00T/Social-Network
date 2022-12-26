import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupDescriptionService {
  getHello(): string {
    return 'Hello World!';
  }
}
