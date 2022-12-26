import { Injectable } from '@nestjs/common';

@Injectable()
export class TwoStepService {
  getHello(): string {
    return 'Hello World!';
  }
}
