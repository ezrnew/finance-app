import { Module } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { PortfoliosController } from './portfolios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Portfolio, PortfolioSchema } from './schemas/portfolio.schema';
import { User, UserSchema } from '../security/users/schemas/user.schema';
import { BondsPolishTreasuryService } from '../instruments/bonds-polish-treasury/bonds-polish-treasury.service';
import { TickersService } from '../instruments/tickers/tickers.service';
// import { BondsModule } from '../bonds/bonds.module';
import { TickersModule } from '../instruments/tickers/tickers.module';
import { CurrenciesModule } from '../general/currencies/currencies.module';
import { BondsPolishTreasuryModule } from '../instruments/bonds-polish-treasury/bonds-polish-treasury.module';
import {
  PortfolioValueTimeseries,
  PortfolioValueTimeseriesSchema,
} from './schemas/portfolioValueTimeseries.schema';
import { PortfoliosTimeseriesService } from './portfoliosTimeseries.service';
import { PortfoliosTimeseriesController } from './portfolios-timeseries.controller';

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
  providers: [PortfoliosService,PortfoliosTimeseriesService],
  controllers: [PortfoliosController,PortfoliosTimeseriesController],
})
export class PortfoliosModule {}
