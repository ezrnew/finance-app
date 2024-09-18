import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JWT_EXP_TIME_IN_MILIS } from '../../common/constants/jwtExpirationTime';
import * as config from '../../../config.json';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: { expiresIn: JWT_EXP_TIME_IN_MILIS },
    }), //?
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
