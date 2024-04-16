import { Module } from '@nestjs/common';
import { PolishTreasury } from './polishTreasury.service';
import { BondsController } from './bonds.controller';
import { CpiModule } from '../general/cpi/cpi.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CpiSchema } from '../general/cpi/schemas/cpi.schema';
import { CoiSchema, EdoSchema, RodSchema, RosSchema } from './schemas/bonds.polishTreasury';
import { BondFactory, CoiFactory, EdoFactory, RodFactory, RosFactory } from './polishTreasury.factory';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cpi', schema: CpiSchema }]),
    MongooseModule.forFeature([{ name: 'Edo', schema: EdoSchema }]),
    MongooseModule.forFeature([{ name: 'Coi', schema: CoiSchema }]),
    MongooseModule.forFeature([{ name: 'Ros', schema: RosSchema }]),
    MongooseModule.forFeature([{ name: 'Rod', schema: RodSchema }]),
  ],
  controllers: [BondsController],
  providers: [PolishTreasury, BondFactory, EdoFactory, CoiFactory, RosFactory, RodFactory],
})
export class BondsModule {}
 