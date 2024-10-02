import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CPIService } from '../general/cpi/cpi.polish.service';
import { BondsPolishTreasuryEmissionService } from '../instruments/bonds-polish-treasury/bonds-polish-treasury-emission.service';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly cpiService: CPIService,
    private readonly bondsPolishTreasuryService: BondsPolishTreasuryEmissionService,
  ) {}
  private readonly logger = new Logger(SchedulerService.name);

  //every 15th day of month 11:10
  @Cron('16 23 15 * *', { timeZone: 'Europe/Berlin' })
  handleCPIUpdate_Polish(): void {
    this.logger.log('updating cpi polish', new Date());
    this.cpiService.updateCPI_Polish();
  }

  @Cron('04 16 * * *', { timeZone: 'Europe/Berlin' })
  checkForEmissionPLtr(): void {
    this.logger.log('checking for polish treasury emission');

    this.bondsPolishTreasuryService.updatePLtr();
  }
}

//   @Cron('*/20 * * * * *', { timeZone: 'Europe/Berlin' })
