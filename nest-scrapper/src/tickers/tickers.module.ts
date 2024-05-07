import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticker, TickerSchema } from './schemas/ticker.schema';
import { TickersController } from './tickers.controller';
import { TickersService } from './tickers.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ticker.name, schema: TickerSchema }])],
  controllers: [TickersController],
  providers: [TickersService],
  exports:[TickersService]
})
export class TickersModule {}