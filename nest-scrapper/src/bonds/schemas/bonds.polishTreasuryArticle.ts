import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PltrArticleDocument = HydratedDocument<PLtrArticle>;

@Schema({collection:"general_PLtr_article"})
export class PLtrArticle {

  @Prop()
  text: string;

//   @Prop()
//   date: Date;
}

export const PLtrArticleSchema = SchemaFactory.createForClass(PLtrArticle);
