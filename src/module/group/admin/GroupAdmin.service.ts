import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupAdminService {
  getHello(): string {
    return 'Hello World!';
  }
}
