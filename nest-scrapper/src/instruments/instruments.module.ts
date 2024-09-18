import { Module } from '@nestjs/common';
import { InstrumentsController } from './instruments.controller';
import { InstrumentsService } from './instruments.service';
import { Edo, EdoSchema } from './bonds-polish-treasury/schemas/bonds.polishTreasury';
import { Ticker, TickerSchema } from '../tickers/schemas/ticker.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BondsPolishTreasuryModule } from './bonds-polish-treasury/bonds-polish-treasury.module';

@Module({
  controllers: [InstrumentsController],
  providers: [InstrumentsService],
  imports: [
    MongooseModule.forFeature([{ name: Edo.name, schema: EdoSchema }]),
    MongooseModule.forFeature([{ name: Ticker.name, schema: TickerSchema }]),
    
    BondsPolishTreasuryModule,
  ],
})
export class InstrumentsModule {}
