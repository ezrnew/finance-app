import { Module } from '@nestjs/common';
import { CPIService } from '../general/cpi/cpi.service';
import { SchedulerService } from './scheduler.service';
import { CpiModule } from '../general/cpi/cpi.module';
import { BondsModule } from '../bonds/bonds.module';

@Module({
  imports: [CpiModule, BondsModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
