import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { SecurityModule } from './security/security.module';
import { InstrumentsModule } from './instruments/instruments.module';
// import { BondsModule } from './bonds/bonds.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { TickersModule } from './tickers/tickers.module';
import * as config from '../config.json'

@Module({
  imports: [
    MongooseModule.forRoot(config.mongodbUri),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({  isGlobal: true, }),
    
    SchedulerModule,
    SecurityModule,

    InstrumentsModule,
    TickersModule,
    // BondsModule,

    CurrenciesModule,
    PortfoliosModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
