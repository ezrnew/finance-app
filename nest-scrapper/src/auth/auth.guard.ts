import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      const token = request.cookies['jt']

      console.log("tokenisko",token)
      console.log("huj",process.env.JWT_SECRET)
      // const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      console.log("przedtry")
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: '123'
            // secret: `${process.env.JWT_SECRET}`
          }
        );
        console.log("przeszlose",payload)

        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
      } catch(e) {
        console.log("error",e)
        throw new UnauthorizedException();
      }
      return true;
    }

  }