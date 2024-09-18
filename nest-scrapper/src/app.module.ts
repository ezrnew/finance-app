import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { SecurityModule } from './security/security.module';
import { AssetsModule } from './assets/assets.module';
import { BondsModule } from './bonds/bonds.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { TickersModule } from './tickers/tickers.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    
    SecurityModule,

    TickersModule,
    SchedulerModule,
    BondsModule,

    CurrenciesModule,
    AssetsModule,
    PortfoliosModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
