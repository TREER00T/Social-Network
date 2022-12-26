import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupAddAdminService {
  getHello(): string {
    return 'Hello World!';
  }
}
