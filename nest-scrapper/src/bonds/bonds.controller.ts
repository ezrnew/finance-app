import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PolishTreasuryService } from './polishTreasury.service';

@Controller('bonds')
export class BondsController {
    constructor(private readonly polishTreasury: PolishTreasuryService) {}

    @Get('PLtr/:bond')
    async calculatePolishTreasury(@Param('bond') bond,
    @Query('day') dayOfMonth: number,
    @Query('ike') ike: boolean,

){

        console.log("calculatingtreasury:",bond)

        const result = await this.polishTreasury.handleBond(bond,dayOfMonth,ike)

        console.log("rezultat",result)

    }

}
