import { Module } from '@nestjs/common';
import { CPIService } from '../general/cpi/cpi.service';
import { SchedulerService } from './scheduler.service';
import { CpiModule } from '../general/cpi/cpi.module';


@Module({
  imports: [CpiModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}