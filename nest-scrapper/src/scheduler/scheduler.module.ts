import { Module } from '@nestjs/common';
import { CpiModule } from '../general/cpi/cpi.module';
import { SchedulerService } from './scheduler.service';
import { BondsPolishTreasuryModule } from '../instruments/bonds-polish-treasury/bonds-polish-treasury.module';
@Module({
  imports: [CpiModule, BondsPolishTreasuryModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
