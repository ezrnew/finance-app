import { Module } from '@nestjs/common';
import { PolishTreasury } from './polishTreasury.service';
import { BondsController } from './bonds.controller';
import { CpiModule } from '../general/cpi/cpi.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CpiSchema } from '../general/cpi/schemas/cpi.schema';
import { CoiSchema, EdoSchema, OtsSchema, RodSchema, RosSchema, TosSchema } from './schemas/bonds.polishTreasury';
import { BondFactory, CoiFactory, EdoFactory, OtsFactory, RodFactory, RosFactory, TosFactory } from './polishTreasury.factory';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cpi', schema: CpiSchema }]),
    MongooseModule.forFeature([{ name: 'Edo', schema: EdoSchema }]),
    MongooseModule.forFeature([{ name: 'Coi', schema: CoiSchema }]),
    MongooseModule.forFeature([{ name: 'Ros', schema: RosSchema }]),
    MongooseModule.forFeature([{ name: 'Rod', schema: RodSchema }]),

    MongooseModule.forFeature([{ name: 'Ots', schema: OtsSchema }]),
    MongooseModule.forFeature([{ name: 'Tos', schema: TosSchema }]),
  ],
  controllers: [BondsController],
  providers: [PolishTreasury, BondFactory, EdoFactory, CoiFactory, RosFactory, RodFactory,OtsFactory,TosFactory],
})
export class BondsModule {}
 