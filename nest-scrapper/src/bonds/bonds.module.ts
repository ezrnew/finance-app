import { Module } from '@nestjs/common';
import { PolishTreasury } from './polishTreasury.service';
import { BondsController } from './bonds.controller';
import { CpiModule } from '../general/cpi/cpi.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CpiSchema } from '../general/cpi/schemas/cpi.schema';
import {
  CoiSchema,
  EdoSchema,
  OtsSchema,
  RodSchema,
  RosSchema,
  TosSchema,
} from './schemas/bonds.polishTreasury';
import {
  BondFactory,
  CoiConcrete,
  EdoConcrete,
  OtsConcrete,
  RodConcrete,
  RosConcrete,
  TosConcrete,
} from './polishTreasury.factory';
import { BondsService } from './bonds.service';
import { PLtrArticle, PLtrArticleSchema } from './schemas/bonds.polishTreasuryArticle';
import { PLtrScrapper } from './bonds.PLtr.scrapper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cpi', schema: CpiSchema }]),
    MongooseModule.forFeature([{ name: 'Edo', schema: EdoSchema }]),
    MongooseModule.forFeature([{ name: 'Coi', schema: CoiSchema }]),
    MongooseModule.forFeature([{ name: 'Ros', schema: RosSchema }]),
    MongooseModule.forFeature([{ name: 'Rod', schema: RodSchema }]),

    MongooseModule.forFeature([{ name: 'Ots', schema: OtsSchema }]),
    MongooseModule.forFeature([{ name: 'Tos', schema: TosSchema }]),
    MongooseModule.forFeature([{ name: PLtrArticle.name, schema: PLtrArticleSchema }]),
  ],
  controllers: [BondsController],
  providers: [
    PolishTreasury,
    BondFactory,
    EdoConcrete,
    CoiConcrete,
    RosConcrete,
    RodConcrete,
    OtsConcrete,
    TosConcrete,
    BondsService,
    PLtrScrapper
  ],
  exports: [BondsService,PLtrScrapper],
})
export class BondsModule {}
