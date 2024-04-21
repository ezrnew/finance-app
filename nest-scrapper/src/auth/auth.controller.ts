import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthGuard } from './auth.guard';
  import { AuthService } from './auth.service';
import { SignInDto } from './dto/signInDto';
import { RegisterDto } from './dto/registerDto';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        // console.log("SIGN IN DTO",signInDto)
      return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        // console.log("SIGN IN DTO",signInDto)
      return this.authService.register(registerDto.email,registerDto.username,registerDto.password);
    }

  
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }
  }