import { Injectable } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { Portfolio } from './schemas/portfolio.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class PortfoliosService {

    constructor(@InjectModel(Portfolio.name) private catModel: Model<Portfolio>,
    @InjectModel(User.name) private userModel: Model<User>
) {}

    async create(username,createPortfolioDto: CreatePortfolioDto): Promise<Portfolio> {

        console.log("NAZWA",createPortfolioDto.name)

        const user = await this.userModel.findOne({username})

        console.log("123xd",username)
        console.log("juzer",user)

        const newPortfolio = {}

        const createdCat = new this.catModel(createPortfolioDto);
        return createdCat.save();
      }



}
