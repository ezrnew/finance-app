import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/registerDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);

    console.log("URZYTKOWNIK",user)
    if (!user) throw new NotFoundException();

    console.log('USER', user);

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }
    console.log("HASLO DZIALA")
    //? sub
    const payload = { sub: user.username, username: user.username };
    return {
      access_token:"huj"
      // access_token: await this.jwtService.signAsync(payload),
    };
  }

  //todo class validation not working
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
    // const salt  = await bcrypt.genSalt()
    return bcrypt.hash(password, 10);
  }

  //   async encryptPassword(password:string){

  //     // const salt  = await bcrypt.genSalt()
  //     return bcrypt.hash(password,10)
  //   }
}
