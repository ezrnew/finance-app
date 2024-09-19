import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { SecurityModule } from './security/security.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXP_TIME_IN_MILIS } from './common/constants/jwtExpirationTime';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: JWT_EXP_TIME_IN_MILIS },
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI),

    ScheduleModule.forRoot(),

    SchedulerModule,
    SecurityModule,

    InstrumentsModule,

    CurrenciesModule,
    PortfoliosModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
