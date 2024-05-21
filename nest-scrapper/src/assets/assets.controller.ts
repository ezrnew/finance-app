import { Controller, Get } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async getAllNames(): Promise<any[]> {
    return this.assetsService.findAll();
  }
}
