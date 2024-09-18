import { Controller, Get } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly assetsService: InstrumentsService) {}

  @Get()
  async getAllNames(): Promise<any[]> {
    return this.assetsService.findAll();
  }
}
