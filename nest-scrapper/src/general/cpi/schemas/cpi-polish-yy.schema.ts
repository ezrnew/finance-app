import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CpiDocument = HydratedDocument<CpiPolishYY>;

// year/year
@Schema({ collection: 'cpi-polish-yy' })
export class CpiPolishYY {
  @Prop()
  year: number;

  @Prop({ type: Number, default: null })
  jan: number | null;
  @Prop({ type: Number, default: null })
  feb: number | null;
  @Prop({ type: Number, default: null })
  mar: number | null;
  @Prop({ type: Number, default: null })
  apr: number | null;
  @Prop({ type: Number, default: null })
  may: number | null;
  @Prop({ type: Number, default: null })
  jun: number | null;
  @Prop({ type: Number, default: null })
  jul: number | null;
  @Prop({ type: Number, default: null })
  aug: number | null;
  @Prop({ type: Number, default: null })
  sep: number | null;
  @Prop({ type: Number, default: null })
  oct: number | null;
  @Prop({ type: Number, default: null })
  nov: number | null;
  @Prop({ type: Number, default: null })
  dec: number | null;
}

export const CpiPolishYYSchema = SchemaFactory.createForClass(CpiPolishYY);
