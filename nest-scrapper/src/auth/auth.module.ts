import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JWT_EXP_TIME_IN_MILIS } from '../constants/jwtExpirationTime';

// console.log("GIGATAJNYSEKRETWCHUJ",process.env.JWT_SECRET)

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    //todo FIX JWT
    JwtModule.register({ global: true, secret: '123', signOptions: { expiresIn: JWT_EXP_TIME_IN_MILIS } }), //?
    // JwtModule.register({ global: true, secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1h' } }), //?
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
