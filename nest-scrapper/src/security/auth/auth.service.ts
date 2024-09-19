import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string, response: Response) {
    const user = await this.usersService.findOne(username);

    if (!user) throw new NotFoundException();

    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }

    //? sub
    const payload = { sub: user.username, username: user.username };
    const jwt = await this.jwtService.signAsync(payload);

    return jwt;
  }

  async register(email: string, username: string, password: string) {
    const existingUser = await this.usersService.findOneUsernameOrEmail(username, email);
    if (existingUser) {
      if (existingUser.email === email) throw new ConflictException('email');
      if (existingUser.username === username) throw new ConflictException('username');
    }

    this.usersService.create(email, username, await this.encryptPassword(password));

    return 3;
  }

  async encryptPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
