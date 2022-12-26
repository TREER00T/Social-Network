import { Injectable } from '@nestjs/common';

@Injectable()
export class VerifyAuthCodeService {
  getHello(): string {
    return 'Hello World!';
  }
}
