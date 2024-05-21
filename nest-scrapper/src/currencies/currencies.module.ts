import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencyRate, CurrencyRateSchema } from './schema/currencyRate.schema';
import { CurrenciesController } from './currencies.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: CurrencyRate.name, schema: CurrencyRateSchema }])],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
