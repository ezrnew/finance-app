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

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ScrapperModule,
    CatsModule,
    TickersModule,
    SchedulerModule,
    BondsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
