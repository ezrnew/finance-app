import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AssetsModule } from './assets/assets.module';
import { AuthModule } from './auth/auth.module';
import { BondsModule } from './bonds/bonds.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScrapperModule } from './scrapper/scrapper.module';
import { TickersModule } from './tickers/tickers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ScrapperModule,
    TickersModule,
    SchedulerModule,
    BondsModule,
    AuthModule,
    UsersModule,
    CurrenciesModule,
    AssetsModule,
    PortfoliosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
