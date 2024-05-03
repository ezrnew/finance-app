import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

type BondPLtr = { //todo cache on client side till next capitalization period to reduce amount of requests?
    bondType: 'pltr';
    quantity:number;
    id: string;
    dayOfMonth:number;
  };

  type Share = {
    ticker:string
    currency:any//todo
    buyPrice:number//?
    



  }
  
 type BondItem = BondPLtr //| 
 type ShareItem = Share

@Schema()
export class User {
//   @Prop()
//   id: string;
  @Prop()
  email: string;
  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  portfolios: ObjectId[]



    // id: string;

    // name:string
    // currency:any//todo
    // freeCash:number
    // assets: { 
    //   bonds: BondItem[]
    //   shares: ShareItem[];
    // };
    // totalValue: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
