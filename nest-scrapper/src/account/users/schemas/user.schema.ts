import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  email: string;
  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  portfolios: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
