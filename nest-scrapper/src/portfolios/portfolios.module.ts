import { Module } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { PortfoliosController } from './portfolios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Portfolio, PortfolioSchema } from './schemas/portfolio.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { PolishTreasuryService } from '../bonds/polishTreasury.service';
import { TickersService } from '../tickers/tickers.service';
import { BondsModule } from '../bonds/bonds.module';
import { TickersModule } from '../tickers/tickers.module';
import { CurrenciesModule } from '../currencies/currencies.module';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Portfolio.name, schema:PortfolioSchema}]),
    MongooseModule.forFeature([{name:User.name, schema:UserSchema}]),
    BondsModule,
    TickersModule,
    CurrenciesModule

  ],
  providers: [PortfoliosService],
  controllers: [PortfoliosController]
})
export class PortfoliosModule {}
