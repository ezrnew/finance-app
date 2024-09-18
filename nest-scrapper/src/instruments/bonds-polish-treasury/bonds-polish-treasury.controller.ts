import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BondsPolishTreasuryService } from './bonds-polish-treasury.service';

@Controller('bonds')
export class BondsPolishTreasuryController {
  constructor(private readonly polishTreasuryService: BondsPolishTreasuryService) {}

  @Get('PLtr/testowy')
  async testowy() {

    return this.polishTreasuryService.handleBondsMultiple([
      { type: 'EDO0521', day: 15 },
      { type: 'EDO0434', day: 1 },
      { type: 'EDO0330', day: 1 },
      { type: 'ROD0135', day: 15 },
      { type: 'COI0726', day: 30 },
      { type: 'OTS1024', day: 1 },
      { type: 'TOS0425', day: 1 },
    ],false)
  }

  @Get('PLtr/:bond')
  async calculatePolishTreasury(
    @Param('bond') bond,
    @Query('day') dayOfMonth: number,
    @Query('ike') ike: boolean,
  ) {
    return this.polishTreasuryService.handleBond(bond, dayOfMonth, ike);
  }
}
