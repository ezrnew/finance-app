import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

//todo firsYear -> firstPeriod

export type EdoDocument = HydratedDocument<Edo>;

@Schema({collection:"bonds_PLtr_edo"})
export class Edo {
  @Prop()
  id: string;

  @Prop()
  firstYear: number;

  @Prop()
  margin: number;
}

export const EdoSchema = SchemaFactory.createForClass(Edo);



export type CoiDocument = HydratedDocument<Coi>;

@Schema({collection:"bonds_PLtr_coi"})
export class Coi {
  @Prop()
  id: string;

  @Prop()
  firstYear: number;

  @Prop()
  margin: number;
}

export const CoiSchema = SchemaFactory.createForClass(Coi);


export type RosDocument = HydratedDocument<Ros>;

@Schema({collection:"bonds_PLtr_ros"})
export class Ros {
  @Prop()
  id: string;

  @Prop()
  firstYear: number;

  @Prop()
  margin: number;
}

export const RosSchema = SchemaFactory.createForClass(Ros);


export type RodDocument = HydratedDocument<Rod>;

@Schema({collection:"bonds_PLtr_rod"})
export class Rod {
  @Prop()
  id: string;

  @Prop()
  firstYear: number;

  @Prop()
  margin: number;
}

export const RodSchema = SchemaFactory.createForClass(Rod);


// fixed

export type OtsDocument = HydratedDocument<Ots>;

@Schema({collection:"bonds_PLtr_ots"})
export class Ots {
  @Prop()
  id: string;

  @Prop()
  rate: number;
}

export const OtsSchema = SchemaFactory.createForClass(Ots);



export type TosDocument = HydratedDocument<Tos>;

@Schema({collection:"bonds_PLtr_tos"})
export class Tos {
  @Prop()
  id: string;

  @Prop()
  rate: number;
}

export const TosSchema = SchemaFactory.createForClass(Tos);