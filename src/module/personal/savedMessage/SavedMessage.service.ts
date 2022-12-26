import { Injectable } from '@nestjs/common';

@Injectable()
export class SavedMessageService {
  getHello(): string {
    return 'Hello World!';
  }
}
