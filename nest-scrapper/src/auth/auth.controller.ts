import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    Res,
    UseGuards
  } from '@nestjs/common';
  import { AuthGuard } from './auth.guard';
  import { AuthService } from './auth.service';
import { SignInDto } from './dto/signInDto';
import { RegisterDto } from './dto/registerDto';
import { Response } from 'express';
import { JWT_EXP_TIME_IN_MILIS } from '../constants/jwtExpirationTime';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response:Response) {
        console.log("SIGN IN DTO",signInDto)
        const token = await this.authService.signIn(signInDto.username, signInDto.password,response)
      if(token){

            response.cookie('jt',token,{
              secure:false,//dev
              sameSite:'strict',
              httpOnly:true,
              expires: new Date(Date.now()+JWT_EXP_TIME_IN_MILIS)
            })

            response.cookie('authorized',true,{
              secure:false,//dev
              sameSite:'strict',
              httpOnly:false,
              expires: new Date(Date.now()+JWT_EXP_TIME_IN_MILIS)
            })

            return 123
      }


      
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