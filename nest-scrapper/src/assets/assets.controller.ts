import { Controller, Get } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {

    constructor(private readonly assetsService: AssetsService){}

    @Get()
    async getAllNames(): Promise<{bonds_pltr:string[],tickers:string[]}> {
        return this.assetsService.findAll();
      }
}
