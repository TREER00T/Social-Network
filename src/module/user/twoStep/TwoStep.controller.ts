import { Controller, Get } from '@nestjs/common';
import { TwoStepService } from './TwoStep.service';

@Controller()
export class TwoStepController {
  constructor(private readonly appService: TwoStepService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
