import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CoiSchema,
  EdoSchema,
  OtsSchema,
  RodSchema,
  RosSchema,
  TosSchema,
} from '../../instruments/bonds-polish-treasury/schemas/bonds.polishTreasury';
import {
  BondsPolishTreassuryEmission,
  PolishTreasuryEmission,
} from '../../instruments/bonds-polish-treasury/schemas/bonds.polishTreasuryArticle';
import { CpiModule } from '../../general/cpi/cpi.module';
import { BondsPolishTreasuryService } from './bonds-polish-treasury.service';
import { BondsPolishTreasuryEmissionService } from './bonds-polish-treasury-emission.service';
import { BondsPolishTreasuryController } from './bonds-polish-treasury.controller';
import {
  BondFactory,
  CoiConcrete,
  EdoConcrete,
  OtsConcrete,
  RodConcrete,
  RosConcrete,
  TosConcrete,
} from './bonds-polish-treasury.factory';
import { BondsPolishTreasuryScrapper } from './bonds-polish-treasury.scrapper';

@Module({
  imports: [
    CpiModule,

    MongooseModule.forFeature([{ name: 'Edo', schema: EdoSchema }]),
    MongooseModule.forFeature([{ name: 'Coi', schema: CoiSchema }]),
    MongooseModule.forFeature([{ name: 'Ros', schema: RosSchema }]),
    MongooseModule.forFeature([{ name: 'Rod', schema: RodSchema }]),

    MongooseModule.forFeature([{ name: 'Ots', schema: OtsSchema }]),
    MongooseModule.forFeature([{ name: 'Tos', schema: TosSchema }]),
    MongooseModule.forFeature([{ name: BondsPolishTreassuryEmission.name, schema: PolishTreasuryEmission }]),
  ],
  providers: [
    BondsPolishTreasuryService,
    BondsPolishTreasuryEmissionService,

    BondsPolishTreasuryScrapper,

    BondFactory,
    EdoConcrete,
    CoiConcrete,
    RosConcrete,
    RodConcrete,
    OtsConcrete,
    TosConcrete,
  ],
  controllers: [BondsPolishTreasuryController],
  exports: [BondsPolishTreasuryService, BondsPolishTreasuryEmissionService],
})
export class BondsPolishTreasuryModule {}
