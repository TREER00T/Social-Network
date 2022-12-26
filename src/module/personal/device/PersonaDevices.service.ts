import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonaDevicesService {
  getHello(): string {
    return 'Hello World!';
  }
}
