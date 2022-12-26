import { Controller, Get } from '@nestjs/common';
import { PersonaDevicesService } from './PersonaDevices.service';

@Controller()
export class PersonaDevicesController {
  constructor(private readonly appService: PersonaDevicesService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
