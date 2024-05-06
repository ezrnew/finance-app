import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { Portfolio } from './schemas/portfolio.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { BuyAssetDto } from './dto/buyAssetDto';
import { SellAssetDto } from './dto/sell-asset-dto';

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
      categories: [{category:'cash',value:0},{category:'shares',value:0},{category:'bonds',value:0}],
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


  async addAccount(username:string,portfolioId:string,name:string) {
    //todo validate if name taken server-side

    console.log("username",username)
    console.log("idk",portfolioId)

    const userOwnsPortfolio = await this.userModel.findOne({ username,portfolios:portfolioId});//todo move to another validating func
    if(!userOwnsPortfolio) throw new UnauthorizedException()

      const portfolio = await this.portfolioModel.findById(portfolioId)

      portfolio.accounts.push({title:name,cash:0,assets:[]})
      console.log("puszlem se ",portfolio.accounts)
      return portfolio.save()


    // const portfolios = await this.portfolioModel.find({'_id':{$in:userPortfolios}})

    // console.log("portfeliska",portfolios)

    // return portfolios

  }

  async addCategory(username:string,portfolioId:string,name:string) {
    const userOwnsPortfolio = await this.userModel.findOne({ username,portfolios:portfolioId});
    if(!userOwnsPortfolio) throw new UnauthorizedException()

      const portfolio = await this.portfolioModel.findById(portfolioId)

      portfolio.categories.push({category:name,value:0})
      return portfolio.save()

  }

  async buyAsset(username:string,buyAssetDto:BuyAssetDto) {


    console.log("NAZWAAAAAAAAAAAAAAAAA",buyAssetDto.asset.name)


  const userOwnsPortfolio = await this.userModel.findOne({ username,portfolios:buyAssetDto.portfolioId});
  if(!userOwnsPortfolio) throw new UnauthorizedException()

    const portfolio = await this.portfolioModel.findById(buyAssetDto.portfolioId)


    const totalPrice= buyAssetDto.price*buyAssetDto.quantity
    console.log("totalp",totalPrice)

    portfolio.totalValue+=totalPrice

    const portfolioCategory = portfolio.categories.find(item =>item.category===buyAssetDto.category)

    if(!portfolioCategory) return false

    portfolioCategory.value+=totalPrice

    const selectedIndex = portfolio.categories.findIndex((item)=>item.category===buyAssetDto.category);

    portfolio.categories[selectedIndex] =portfolioCategory



    const portfolioAccount = portfolio.accounts.find(item =>item.title===buyAssetDto.account)

    if(!portfolioAccount) return false

    if(!buyAssetDto.paymentAdded) portfolioAccount.cash-=totalPrice

    if(portfolioAccount.cash<0) return false


    console.log("NAZWAAAAAAAAAAAAAAAAA",buyAssetDto.asset.name)


    // if(buyAssetDto.asset.type==="bonds_pltr"){
      portfolioAccount.assets.push({
        id:crypto.randomUUID(),
        name:buyAssetDto.asset.name,
        type:buyAssetDto.asset.type,
        category:buyAssetDto.category,
      
        date: buyAssetDto.date,
        currency:buyAssetDto.currency,
        currencyRate:buyAssetDto.currencyRate, //?potrzebne?
        price:buyAssetDto.price,
        quantity:buyAssetDto.quantity


      })

      // console.log("portfolioAcc",portfolioAccount)

      const selectedIndex2 = portfolio.accounts.findIndex(item =>item.title===buyAssetDto.account)

      portfolio.accounts[selectedIndex2] =portfolioAccount


      return portfolio.save()


    // }


// if(buyAssetDto.asset.type==="ticker"){
//     portfolioAccount.assets.push({
//     name:buyAssetDto.asset.value,
//       type:buyAssetDto.asset.type

//   })
      
    // }


    // if(){}

    




  }


  async sellAsset(username:string,sellAssetDto:SellAssetDto) {

    const userOwnsPortfolio = await this.userModel.findOne({ username,portfolios:sellAssetDto.portfolioId});
    if(!userOwnsPortfolio) throw new UnauthorizedException()


      const portfolio = await this.portfolioModel.findById(sellAssetDto.portfolioId)

      const portfolioCategory = portfolio.categories.find(item =>item.category===sellAssetDto.category)
      if(!portfolioCategory) return false

      const categoryIndex = portfolio.categories.findIndex(item =>item.category===sellAssetDto.category)



      const portfolioAccount = portfolio.accounts.find(item =>item.title===sellAssetDto.account)

      if(!portfolioAccount) return false

      const accountIndex = portfolio.accounts.findIndex(item =>item.title===sellAssetDto.account)



      


      const {...sellItem} = portfolio.accounts[accountIndex].assets.find(item => item.id===sellAssetDto.assetId)

      console.log("itemek do sprzontniencia",sellItem )

      sellItem.quantity=sellItem.quantity-sellAssetDto.quantityToSell

      if(sellItem.quantity<=0) {
        portfolio.accounts[accountIndex].assets = portfolio.accounts[accountIndex].assets.filter(item => item.id !== sellAssetDto.assetId) 

      } else{
        console.log("els")
        const sellItemIndex = portfolio.accounts[accountIndex].assets.findIndex(item => item.id===sellAssetDto.assetId)
        console.log("indeks itemka",sellItemIndex)
        console.log("xddd",portfolio.accounts[accountIndex].assets[sellItemIndex].quantity)

        portfolio.accounts[accountIndex].assets[sellItemIndex].quantity=portfolio.accounts[accountIndex].assets[sellItemIndex].quantity -sellAssetDto.quantityToSell


      }
      console.log("nowa kaska",portfolio.accounts[accountIndex].cash,sellAssetDto.quantityToSell*sellItem.price)
      
      console.log("kategorie",portfolio.categories)

      console.log( portfolio.accounts[accountIndex])
      portfolio.categories[categoryIndex].value-=sellAssetDto.quantityToSell*sellItem.price
      
      const cashCategoryIndex = portfolio.categories.findIndex(item => item.category='cash')
      
      portfolio.categories[cashCategoryIndex].value+=sellAssetDto.quantityToSell*sellItem.price

      portfolio.accounts[accountIndex].cash+=sellAssetDto.quantityToSell*sellItem.price//+portfolio.accounts[accountIndex].cash
      


      // console.log("nowe portfolio",portfolio)
// 
      try {
        await this.portfolioModel.findByIdAndUpdate(sellAssetDto.portfolioId,portfolio)
        
        // const res = await portfolio.save()
        // console.log("res",res)
      } catch (error) {
        console.log("error",error)
      }

      
      return 3 

  

      



      return 3
  }


}
