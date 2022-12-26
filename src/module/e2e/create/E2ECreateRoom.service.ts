import { Injectable } from '@nestjs/common';

@Injectable()
export class E2ECreateRoomService {
  getHello(): string {
    return 'Hello World!';
  }
}
