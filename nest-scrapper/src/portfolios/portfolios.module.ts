import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../security/users/schemas/user.schema';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';
import { Portfolio, PortfolioSchema } from './schemas/portfolio.schema';
import { CurrenciesModule } from '../general/currencies/currencies.module';
import { BondsPolishTreasuryModule } from '../instruments/bonds-polish-treasury/bonds-polish-treasury.module';
import { TickersModule } from '../instruments/tickers/tickers.module';
import { PortfoliosTimeseriesController } from './portfolios-timeseries.controller';
import { PortfoliosTimeseriesService } from './portfoliosTimeseries.service';
import {
  PortfolioValueTimeseries,
  PortfolioValueTimeseriesSchema,
} from './schemas/portfolioValueTimeseries.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
      { name: User.name, schema: UserSchema },
      { name: PortfolioValueTimeseries.name, schema: PortfolioValueTimeseriesSchema },
    ]),
    BondsPolishTreasuryModule,
    TickersModule,
    CurrenciesModule,
  ],
  providers: [PortfoliosService, PortfoliosTimeseriesService],
  controllers: [PortfoliosController, PortfoliosTimeseriesController],
})
export class PortfoliosModule {}
