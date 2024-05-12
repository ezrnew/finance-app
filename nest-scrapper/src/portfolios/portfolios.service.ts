import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { Portfolio } from './schemas/portfolio.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { BuyAssetDto } from './dto/buyAssetDto';
import { SellAssetDto } from './dto/sell-asset-dto';
import { PolishTreasuryService } from '../bonds/polishTreasury.service';
import { TickersService } from '../tickers/tickers.service';
import { AddOperationDto } from './dto/add-operation.dto';
import { CurrenciesService } from '../currencies/currencies.service';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectModel(Portfolio.name) private portfolioModel: Model<Portfolio>,
    @InjectModel(User.name) private userModel: Model<User>,
    private bonds_pltrService:PolishTreasuryService,
    private tickerService:TickersService,
    private currenciesService:CurrenciesService,


  ) {}


  private  reeavluateCategoriesAndTotalValue(portf:Document<unknown, {}, Portfolio> & Portfolio & {
    _id: Types.ObjectId;
}) {

  // const portf = {...portfolio}

  portf.categories.forEach(category => category.value=0)
  portf.totalValue=0
  
  portf.accounts.forEach(account =>{

    const cashIndex = portf.categories.findIndex(item => item.category==='cash')

    portf.categories[cashIndex].value+=account.cash


    account.assets.forEach(asset =>{

      const index = portf.categories.findIndex(category => category.category===asset.category)
      if(index)
      portf.categories[index].value+=asset.price*asset.quantity
    })

  })

  portf.categories.forEach(category => portf.totalValue+=category.value )



return portf
  }



  async reevaluateAssets(username, portfolioId: string) {

    const userOwnsPortfolio = await this.userModel.findOne({ username,portfolios:portfolioId});
    if(!userOwnsPortfolio) throw new UnauthorizedException()

      const portfolio = await this.portfolioModel.findById(portfolioId)


      const assets = getFlattenAssets(portfolio.accounts)

      async function calculate() {
        const promises = portfolio.accounts.map(async (account) => {
            await Promise.all(account.assets.map(async (asset) => {
              console.log("ASSETPRICE",asset)
                asset.price = await handleAssetUpdate.call(this, asset);
            }));
        });
        await Promise.all(promises);



        
        return 1;
    }

      const res = await calculate.call(this)
      const reevaluatedPortfolio = this.reeavluateCategoriesAndTotalValue(portfolio)
      
      // console.log("po update",portfolio.accounts[0].assets)


     async function handleAssetUpdate(asset:any){ //todo create handleMany func to avoid multiple db requests
        if(asset.type==='bonds_pltr') return asset.buyPrice*(await this.bonds_pltrService.handleBond(asset.name))
        if(asset.type==='tickers'){
          console.log("ASSETCURRENCY CURRENCY",asset.currency)
          console.log("PORTFCURRENCY",portfolio.currency)
          const tickerResult =((await this.tickerService.getOne(asset.name)).price)
          // console.log("TICKER RESULT:",tickerResult)
          console.log("ticker result price",tickerResult)
          const currencyRate = await this.currenciesService.getCurrencyRate(asset.currency,portfolio.currency)
          console.log("CURRENCY RATEAAAA",)
          return asset.price=tickerResult*currencyRate

        }
          
        return 1
      }

      // const bonds_pltr = assets.filter(item => item.type==='bonds_pltr')

      // bonds_pltr.forEach(async(item) =>{
      //   console.log("ITEMEKS",item)
      //   const rezultatObl= await this.bonds_pltrService.handleBond(item.name) //todo include day/ike
      //   console.log("REZULTTAAAA",rezultatObl)
      //   item.price = rezultatObl
      // })

      
      
      console.log("portfolioxddddddddddd", reevaluatedPortfolio.accounts[0].assets[1])
      
      await this.portfolioModel.findByIdAndUpdate(portfolioId,reevaluatedPortfolio)




    return 3
  }


  async create(username, createPortfolioDto: CreatePortfolioDto) {
    //todo validate if name taken server-side

    const user = await this.userModel.findOne({ username });

    const newPortfolio = new this.portfolioModel({
      title: createPortfolioDto.name,
      currency: 'PLN', //todo
      totalValue: 0,
      operationHistory:[],
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

    return portfolios


  }


  async getById(username:string,id:string) {
    //todo validate if name taken server-side

    console.log("username",username)
    console.log("idk",id)

    const userOwnsPortfolio = await this.userModel.findOne({ username,portfolios:id});
    if(!userOwnsPortfolio) throw new UnauthorizedException()

      return this.portfolioModel.findById(id)

  }


  async addAccount(username:string,portfolioId:string,name:string) {
    //todo validate if name taken server-side


    const userOwnsPortfolio = await this.userModel.findOne({ username,portfolios:portfolioId});//todo move to another validating func
    if(!userOwnsPortfolio) throw new UnauthorizedException()

      const portfolio = await this.portfolioModel.findById(portfolioId)

      portfolio.accounts.push({id:crypto.randomUUID(),title:name,cash:0,assets:[]})
      // console.log("puszlem se ",portfolio.accounts)
      return portfolio.save()

  }

  async addCategory(username:string,portfolioId:string,name:string) {
    const userOwnsPortfolio = await this.userModel.findOne({ username,portfolios:portfolioId});
    if(!userOwnsPortfolio) throw new UnauthorizedException()

      const portfolio = await this.portfolioModel.findById(portfolioId)

      portfolio.categories.push({category:name,value:0})
      return portfolio.save()

  }

  async buyAsset(username:string,buyAssetDto:BuyAssetDto) {


  const userOwnsPortfolio = await this.userModel.findOne({ username,portfolios:buyAssetDto.portfolioId});
  if(!userOwnsPortfolio) throw new UnauthorizedException()

    const portfolio = await this.portfolioModel.findById(buyAssetDto.portfolioId)


    const totalPrice= buyAssetDto.price*buyAssetDto.quantity
    // console.log("totalp",totalPrice)

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

      portfolioAccount.assets.push({
        id:crypto.randomUUID(),
        name:buyAssetDto.asset.name,
        type:buyAssetDto.asset.type,
        category:buyAssetDto.category,
      
        date: buyAssetDto.date,
        currency:buyAssetDto.currency,
        currencyRate:buyAssetDto.currencyRate, //?potrzebne?
        buyPrice:buyAssetDto.price,
        price:buyAssetDto.price,
        // originalCurrrencyPrice:buyAssetDto.price,
        quantity:buyAssetDto.quantity


      })

      portfolio.operationHistory.push({
        id:crypto.randomUUID(),
        accountName:portfolioAccount.title,
        type:"buy",
        amount:totalPrice,
        date: new Date(Date.now()),
        asset:buyAssetDto.asset.name,
        quantity:buyAssetDto.quantity,
        buyDate:buyAssetDto.date
      })



      const selectedIndex2 = portfolio.accounts.findIndex(item =>item.title===buyAssetDto.account)

      portfolio.accounts[selectedIndex2] =portfolioAccount


      return portfolio.save()



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

      const sellItemIndex = portfolio.accounts[accountIndex].assets.findIndex(item => item.id===sellAssetDto.assetId)

      console.log("itemek do sprzontniencia",sellItem )

      sellItem.quantity=sellItem.quantity-sellAssetDto.quantityToSell

      if(sellItem.quantity<=0) {
        portfolio.accounts[accountIndex].assets = portfolio.accounts[accountIndex].assets.filter(item => item.id !== sellAssetDto.assetId) 

      } else{
        // console.log("els")
        // const sellItemIndex = portfolio.accounts[accountIndex].assets.findIndex(item => item.id===sellAssetDto.assetId)
        // console.log("indeks itemka",sellItemIndex)
        // console.log("xddd",portfolio.accounts[accountIndex].assets[sellItemIndex].quantity)

        portfolio.accounts[accountIndex].assets[sellItemIndex].quantity=portfolio.accounts[accountIndex].assets[sellItemIndex].quantity -sellAssetDto.quantityToSell


      }


      console.log( portfolio.accounts[accountIndex])
      portfolio.categories[categoryIndex].value-=sellAssetDto.quantityToSell*sellItem.price
      
      const cashCategoryIndex = portfolio.categories.findIndex(item => item.category='cash')
      
      portfolio.categories[cashCategoryIndex].value+=sellAssetDto.quantityToSell*sellItem.price

      console.log("ustawiam kesz",sellAssetDto.quantityToSell*sellItem.price,sellAssetDto.quantityToSell,sellItem.price)

      portfolio.accounts[accountIndex].cash+=sellAssetDto.quantityToSell*sellItem.price
      

      portfolio.operationHistory.push({
        id:crypto.randomUUID(),
        accountName:portfolioAccount.title,
        type:"sell",
        amount:sellAssetDto.quantityToSell*sellItem.price,
        date: new Date(Date.now()),
        asset:portfolio.accounts[accountIndex].assets[sellItemIndex],
        quantity:sellAssetDto.quantityToSell,
      })


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
  

  }
  


  // async sellAsset(username:string,sellAssetDto:SellAssetDto) {



  
  // }

    async addAccountOperation(username, addOperationDto: AddOperationDto) {
    //todo validate if name taken server-side

    const userOwnsPortfolio = await this.userModel.findOne({ username,portfolios:addOperationDto.portfolioId});
    if(!userOwnsPortfolio) throw new UnauthorizedException()


      const portfolio = await this.portfolioModel.findById(addOperationDto.portfolioId)

      const accountIndex = portfolio.accounts.findIndex(account => account.id===addOperationDto.accountId)

      portfolio.accounts[accountIndex].cash+=addOperationDto.amount

      portfolio.operationHistory.push({
        id:crypto.randomUUID(),
        accountName:portfolio.accounts[accountIndex].title,
        type:(addOperationDto.amount<0) ? 'withdraw' : 'deposit',
        amount:addOperationDto.amount,
        date: new Date(Date.now()),

      })

      if(portfolio.accounts[accountIndex].cash<0) throw new BadRequestException()

      return this.portfolioModel.findByIdAndUpdate(addOperationDto.portfolioId,portfolio)

      
  }







}


 function getFlattenAssets(accounts: { title: string; cash: number; assets: any[] }[]) {
  const result: any = [];

  accounts.forEach((account) => {
    const { title, assets } = account;
    assets.forEach((asset) => {
      result.push({ ...asset, account: title });
    });
  });

  return result;
}
