import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { createTickerDto } from './dto/create-ticker.dto';
import { TickersService } from './tickers.service';
import { Ticker } from './schemas/ticker.schema';


@Controller('tickers')
export class TickersController {
  constructor(private readonly tickerService: TickersService) {}


  @Post()
  async create(@Body() createTickerDto: createTickerDto) {

    await this.tickerService.create(createTickerDto);

  }


    @Get(':name')
  findOne(@Param('name') name: string) {
    return this.tickerService.findOne(name);

  }

  @Get()
  async findAll(): Promise<Ticker[]> {
    return this.tickerService.findAll();
  }

  // @Put(':id') // Update cat endpoint with an ID parameter
  // async update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto): Promise<Cat> {
  //   return this.catsService.update(id, updateCatDto);
  // }


//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return `This action returns a #${id} cat`;
//   }

// //   @Put(':id')
//   update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
//     return `This action updates a #${id} cat`;
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return `This action removes a #${id} cat`;
//   }
// }
}