import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { Portfolio } from './schemas/portfolio.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectModel(Portfolio.name) private portfolioModel: Model<Portfolio>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(username, createPortfolioDto: CreatePortfolioDto) {
    //todo validate if name taken server-side

    const user = await this.userModel.findOne({ username });

    const newPortfolio = new this.portfolioModel({
      title: createPortfolioDto.name,
      currency: 'PLN', //todo
      totalValue: 0,
      categories: [{category:'shares',value:0},{category:'bonds',value:0}],
      accounts: [],
    });

    user.portfolios.push(newPortfolio.id);

    await user.save();

    return newPortfolio.save();
  }

  async getAll(username:string) {
    //todo validate if name taken server-side

    const userPortfolios = await this.userModel.findOne({ username }).distinct('portfolios');

    const portfolios = await this.portfolioModel.find({'_id':{$in:userPortfolios}})

    console.log("portfeliska",portfolios)

    return portfolios


  }


  async getById(username:string,id:string) {
    //todo validate if name taken server-side

    console.log("username",username)
    console.log("idk",id)

    const userOwnsPortfolio = await this.userModel.findOne({ username,portfolios:id});
    if(!userOwnsPortfolio) throw new UnauthorizedException()

      return this.portfolioModel.findById(id)


    // const portfolios = await this.portfolioModel.find({'_id':{$in:userPortfolios}})

    // console.log("portfeliska",portfolios)

    // return portfolios

  }


  async addAccount(username:string,id:string,name:string) {
    //todo validate if name taken server-side

    console.log("username",username)
    console.log("idk",id)

    const userOwnsPortfolio = await this.userModel.findOne({ username,portfolios:id});//todo move to another validating func
    if(!userOwnsPortfolio) throw new UnauthorizedException()

      const portfolio = await this.portfolioModel.findById(id)

      portfolio.accounts.push({title:name,cash:0,assets:[]})
      console.log("puszlem se ",portfolio.accounts)
      return portfolio.save()


    // const portfolios = await this.portfolioModel.find({'_id':{$in:userPortfolios}})

    // console.log("portfeliska",portfolios)

    // return portfolios

  }

  async addCategory(username:string,id:string,name:string) {
    const userOwnsPortfolio = await this.userModel.findOne({ username,portfolios:id});
    if(!userOwnsPortfolio) throw new UnauthorizedException()

      const portfolio = await this.portfolioModel.findById(id)

      portfolio.categories.push({category:name,value:0})
      return portfolio.save()

  }


}
