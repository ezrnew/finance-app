import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { JWT_EXP_TIME_IN_MILIS } from './common/constants/jwtExpirationTime';
import { GeneralModule } from './general/general.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SecurityModule } from './security/security.module';

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

    SecurityModule,
    SchedulerModule,

    GeneralModule,
    InstrumentsModule,
    PortfoliosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
