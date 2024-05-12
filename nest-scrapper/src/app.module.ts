import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { ScrapperService } from './scrapper/scrapper.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ScrapperModule } from './scrapper/scrapper.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CatsModule } from './cats/cats.module';
import { TickersModule } from './tickers/tickers.module';
import { SchedulerService } from './scheduler/scheduler.service';
import { SchedulerModule } from './scheduler/scheduler.module';
import { BondsModule } from './bonds/bonds.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { AssetsModule } from './assets/assets.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { CurrenciesController } from './currencies/currencies.controller';



@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ScrapperModule,
    CatsModule,
    TickersModule,
    SchedulerModule,
    BondsModule,
    AuthModule,
    UsersModule,
    CurrenciesModule,
    AssetsModule,
    PortfoliosModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
