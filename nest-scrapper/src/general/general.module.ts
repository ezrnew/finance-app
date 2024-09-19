import { Module } from '@nestjs/common';
import { CpiModule } from './cpi/cpi.module';
import { CurrenciesModule } from './currencies/currencies.module';

@Module({
  imports: [CpiModule, CurrenciesModule],
})
export class GeneralModule {}
