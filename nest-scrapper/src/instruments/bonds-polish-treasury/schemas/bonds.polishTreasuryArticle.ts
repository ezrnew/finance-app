import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

type PolishTreasuryEmission = HydratedDocument<BondsPolishTreassuryEmission>;

@Schema({ collection: 'general_PLtr_article' })
export class BondsPolishTreassuryEmission {
  @Prop()
  text: string;

  //   @Prop()
  //   date: Date;
}

export const PolishTreasuryEmission = SchemaFactory.createForClass(BondsPolishTreassuryEmission);
