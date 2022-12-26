import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupUsersService {
  getHello(): string {
    return 'Hello World!';
  }
}
