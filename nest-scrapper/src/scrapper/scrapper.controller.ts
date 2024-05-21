import { Controller, Get, Param } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';

@Controller('scrapper')
export class ScrapperController {
  constructor(private readonly _scrapperService: ScrapperService) {}

  @Get(':ticker')
  getByTicker(@Param('ticker') id: string) {
    return this._scrapperService.getByTicker(id);
  }
}
