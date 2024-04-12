import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CPIService } from '../general/cpi/cpi.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly cpiService: CPIService) {}
  private readonly logger = new Logger(SchedulerService.name);

  //every 15th day of month 11:10
  @Cron('11 10 15 * *', { timeZone: 'Europe/Berlin' })
  handleCPIUpdate_Polish(): void {
      this.logger.debug('updating cpi polish', new Date());
      this.cpiService.updateCPI_Polish();
    }
}

//   @Cron('*/20 * * * * *', { timeZone: 'Europe/Berlin' })