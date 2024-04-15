import { Controller, Get, Param, Post } from '@nestjs/common';
import { PolishTreasury } from './polishTreasury.service';

@Controller('bonds')
export class BondsController {
    constructor(private readonly polishTreasury: PolishTreasury) {}

    @Get('polish/treasury/:bond')
    async calculatePolishTreasury(@Param('bond') bond){

        console.log("calculatingtreasury:",bond)

        const result = await this.polishTreasury.handleBond(bond)

        console.log("rezultat",result)

    }

}
