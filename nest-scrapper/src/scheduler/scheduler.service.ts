import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CPIService } from '../general/cpi/cpi.polish.service';
import { BondsPolishTreasuryEmissionService } from '../instruments/bonds-polish-treasury/bonds-polish-treasury-emission.service';
import { logger } from '../common/Logger';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly cpiService: CPIService,
    private readonly bondsPolishTreasuryService: BondsPolishTreasuryEmissionService,
  ) {}

  //every 15th day of month 11:10
  @Cron('10 11 15 * *', { timeZone: 'Europe/Berlin' })
  handleCPIUpdate_Polish(): void {
    logger.writeToFile('scrapping polish cpi: https://stat.gov.pl/wykres/1.html');
    this.cpiService.updateCPI_Polish();
  }

  @Cron('04 16 * * *', { timeZone: 'Europe/Berlin' })
  checkForEmissionPLtr(): void {
    logger.writeToFile('checking for polish treasury emission: https://www.obligacjeskarbowe.pl/komunikaty/');

    this.bondsPolishTreasuryService.updatePLtr();
  }
}

//   @Cron('*/20 * * * * *', { timeZone: 'Europe/Berlin' })
