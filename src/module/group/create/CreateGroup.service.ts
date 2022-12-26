import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateGroupService {
  getHello(): string {
    return 'Hello World!';
  }
}
