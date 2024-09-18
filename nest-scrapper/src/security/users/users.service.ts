import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username });
  }

  async findOneUsernameOrEmail(username: string, email: string): Promise<User | undefined> {
    return this.userModel.findOne({ $or: [{ username }, { email }] });
  }

  async create(email: string, username: string, password: string) {
    const newUser = await new this.userModel({ email, username, password });

    return newUser.save();
  }
}
