import { Module } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { PortfoliosController } from './portfolios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Portfolio, PortfolioSchema } from './schemas/portfolio.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Portfolio.name, schema:PortfolioSchema}]),
    MongooseModule.forFeature([{name:User.name, schema:UserSchema}])
  ],
  providers: [PortfoliosService],
  controllers: [PortfoliosController]
})
export class PortfoliosModule {}
