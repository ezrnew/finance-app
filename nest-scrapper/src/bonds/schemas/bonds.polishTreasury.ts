import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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