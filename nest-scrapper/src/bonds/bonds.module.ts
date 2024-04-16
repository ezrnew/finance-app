import { Module } from '@nestjs/common';
import { PolishTreasury } from './polishTreasury.service';
import { BondsController } from './bonds.controller';
import { CpiModule } from '../general/cpi/cpi.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CpiSchema } from '../general/cpi/schemas/cpi.schema';
import { CoiSchema, EdoSchema } from './schemas/bonds.polishTreasury';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Cpi', schema: CpiSchema }]),
        MongooseModule.forFeature([{ name: 'Edo', schema: EdoSchema }]),
        MongooseModule.forFeature([{ name: 'Coi', schema: CoiSchema }]),

    ],
    controllers: [BondsController],
    providers:[PolishTreasury]
})
export class BondsModule {}
