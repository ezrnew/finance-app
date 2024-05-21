import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { Edo, EdoSchema } from '../bonds/schemas/bonds.polishTreasury';
import { Ticker, TickerSchema } from '../tickers/schemas/ticker.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService],
  imports: [
    MongooseModule.forFeature([{ name: Edo.name, schema: EdoSchema }]),
    MongooseModule.forFeature([{ name: Ticker.name, schema: TickerSchema }]),
  ],
})
export class AssetsModule {}
