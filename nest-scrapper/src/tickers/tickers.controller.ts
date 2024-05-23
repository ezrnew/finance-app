import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { createTickerDto } from './dto/create-ticker.dto';
import { TickersService } from './tickers.service';
import { Ticker } from './schemas/ticker.schema';

@Controller('tickers')
export class TickersController {
  constructor(private readonly tickerService: TickersService) {}

  @Get('/add/:name')
  async addNew(@Param('name') name: string) {
     return this.tickerService.addNew(name);
  }

  @Get('/get/:name')
  findOne(@Param('name') name: string) {
    return this.tickerService.calculateOne(name);
  }

  @Get()
  async findAll(): Promise<Ticker[]> {
    return this.tickerService.findAll();
  }

}
