import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenService {
  getHello(): string {
    return 'Hello World!';
  }
}
