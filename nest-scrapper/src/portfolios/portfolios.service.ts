import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { Portfolio } from './schemas/portfolio.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { User } from '../security/users/schemas/user.schema';
import { BuyAssetDto } from './dto/buyAssetDto';
import { SellAssetDto } from './dto/sell-asset-dto';
import { BondsPolishTreasuryService } from '../instruments/bonds-polish-treasury/bonds-polish-treasury.service';
import { TickersService } from '../instruments/tickers/tickers.service';
import { AddOperationDto } from './dto/add-operation.dto';
import { CurrenciesService } from '../general/currencies/currencies.service';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { CurrencyType } from 'src/general/currencies/schema/currencyRate.schema';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { Asset, AssetType, AssetWithDay } from 'src/common/types/portfolioAsset.type';
import { PortfolioValueTimeseries } from './schemas/portfolioValueTimeseries.schema';
import { PortfoliosTimeseriesService } from './portfoliosTimeseries.service';
import { isDateOlderThanXHours } from '../common/utils/date.utils';

@Injectable()
export class PortfoliosService {
  private readonly _logger = new Logger(PortfoliosService.name);

  constructor(
    @InjectModel(Portfolio.name) private portfolioModel: Model<Portfolio>,
    @InjectModel(User.name) private userModel: Model<User>,
    private bonds_pltrService: BondsPolishTreasuryService,
    private tickerService: TickersService,
    private currenciesService: CurrenciesService,
    private portfolioTimeseriesService: PortfoliosTimeseriesService,
  ) {}

  async create(username: string, createPortfolioDto: CreatePortfolioDto) {
    const user = await this.userModel.findOne({ username });

    const newPortfolio = new this.portfolioModel({
      title: createPortfolioDto.name,
      currency: createPortfolioDto.currency,
      totalValue: 0,
      ownContributionValue:0,
      operationHistory: [],
      categories: [],
      accounts: [],
      assets: [],
      createdAt: new Date(Date.now()),
      timeseriesValueLastUpdate: new Date(Date.now()-(24*60*60*1000)) //? 24h
    });

    user.portfolios.push(newPortfolio.id);

    await user.save();

    return newPortfolio.save();
  }

  async getAll(username: string) {
    const userPortfolios = await this.userModel.findOne({ username }).distinct('portfolios');

    const portfolios = await this.portfolioModel.find({ _id: { $in: userPortfolios } });

    return portfolios;
  }

  async getById(username: string, id: string) {
    const userOwnsPortfolio = await this.userModel.findOne({ username, portfolios: id });
    if (!userOwnsPortfolio) throw new UnauthorizedException();

    return this.portfolioModel.findById(id);
  }

  async addAccount(username: string, portfolioId: string, name: string) {
    const userOwnsPortfolio = await this.userModel.findOne({ username, portfolios: portfolioId });
    if (!userOwnsPortfolio) throw new UnauthorizedException();

    const portfolio = await this.portfolioModel.findById(portfolioId);

    portfolio.accounts.push({ id: crypto.randomUUID(), title: name, cash: 0 });
    return portfolio.save();
  }

  async addCategory(username: string, portfolioId: string, name: string) {
    const userOwnsPortfolio = await this.userModel.findOne({ username, portfolios: portfolioId });
    if (!userOwnsPortfolio) throw new UnauthorizedException();

    const portfolio = await this.portfolioModel.findById(portfolioId);

    portfolio.categories.push({ category: name, value: 0 });
    return portfolio.save();
  }

  async buyAsset(username: string, buyAssetDto: BuyAssetDto) {
    const userOwnsPortfolio = await this.userModel.findOne({ username, portfolios: buyAssetDto.portfolioId });
    if (!userOwnsPortfolio) throw new UnauthorizedException();

    const portfolio = await this.portfolioModel.findById(buyAssetDto.portfolioId);

    const totalPrice = buyAssetDto.price * buyAssetDto.quantity*buyAssetDto.currencyRate;

    portfolio.totalValue += totalPrice;

    const portfolioCategory = portfolio.categories.find((item) => item.category === buyAssetDto.category);

    if (!portfolioCategory) return false;

    portfolioCategory.value += totalPrice;
    //
    const selectedIndex = portfolio.categories.findIndex((item) => item.category === buyAssetDto.category);

    portfolio.categories[selectedIndex] = portfolioCategory; //?

    const portfolioAccount = portfolio.accounts.find((item) => item.id === buyAssetDto.accountId);

    if (!portfolioAccount) return false;

    if (!buyAssetDto.paymentAdded) {
      portfolioAccount.cash -= totalPrice;

      if (portfolioAccount.cash < 0) return false;
    } else {
      portfolio.ownContributionValue += totalPrice
    }

    portfolio.assets.push({
      accountId: buyAssetDto.accountId,
      category: buyAssetDto.category,
      id: crypto.randomUUID(),
      name: buyAssetDto.asset.name,
      type: buyAssetDto.asset.type,

      date: buyAssetDto.date,
      currency: buyAssetDto.currency,
      currencyRate: buyAssetDto.currencyRate, //?potrzebne?
      buyPrice: buyAssetDto.price,
      price: buyAssetDto.price,
      originalCurrencyPrice: buyAssetDto.price,
      originalCurrencyBuyPrice: buyAssetDto.price,
      quantity: buyAssetDto.quantity,
    });

    portfolio.operationHistory.push({
      id: crypto.randomUUID(),
      accountName: portfolioAccount.title,
      type: 'buy',
      amount: totalPrice,
      date: new Date(Date.now()),
      asset: buyAssetDto.asset.name,
      quantity: buyAssetDto.quantity,
      buyDate: buyAssetDto.date,
    });
    //

    const selectedIndex2 = portfolio.accounts.findIndex((item) => item.title === buyAssetDto.accountId);

    portfolio.accounts[selectedIndex2] = portfolioAccount;
    //

    return this.portfolioModel.findByIdAndUpdate(buyAssetDto.portfolioId, portfolio); 



  }

  async sellAsset(username: string, sellAssetDto: SellAssetDto) {
    const userOwnsPortfolio = await this.userModel.findOne({
      username,
      portfolios: sellAssetDto.portfolioId,
    });
    if (!userOwnsPortfolio) throw new UnauthorizedException();

    const portfolio = await this.portfolioModel.findById(sellAssetDto.portfolioId);

    const portfolioCategory = portfolio.categories.find((item) => item.category === sellAssetDto.category);
    if (!portfolioCategory) return false;

    const categoryIndex = portfolio.categories.findIndex((item) => item.category === sellAssetDto.category);

    const portfolioAccount = portfolio.accounts.find((item) => item.id === sellAssetDto.accountId);

    if (!portfolioAccount) return false;

    const accountIndex = portfolio.accounts.findIndex((item) => item.id === sellAssetDto.accountId);

    const { ...sellItem } = portfolio.assets.find((item) => item.id === sellAssetDto.assetId);

    const sellItemIndex = portfolio.assets.findIndex((item) => item.id === sellAssetDto.assetId);

    sellItem.quantity = sellItem.quantity - sellAssetDto.quantityToSell;

    if (sellItem.quantity <= 0) {
      portfolio.assets = portfolio.assets.filter((item) => item.id !== sellAssetDto.assetId);
    } else {
      portfolio.assets[sellItemIndex].quantity =
        portfolio.assets[sellItemIndex].quantity - sellAssetDto.quantityToSell;
    }

    const sellAmount = sellAssetDto.quantityToSell * sellItem.price;

    portfolio.categories[categoryIndex].value -= sellAmount;

    portfolio.freeCash += sellAmount;

    portfolio.accounts[accountIndex].cash += sellAmount;

    portfolio.operationHistory.push({
      id: crypto.randomUUID(),
      accountName: portfolioAccount.title,
      type: 'sell',
      amount: sellAmount,
      date: new Date(Date.now()),
      asset: portfolio.assets[sellItemIndex].name,
      quantity: sellAssetDto.quantityToSell,
    });

    try {
      await this.portfolioModel.findByIdAndUpdate(sellAssetDto.portfolioId, portfolio);
    } catch (error) {
      console.error('error', error);
    }

    return 3;
  }

  async addAccountOperation(username, addOperationDto: AddOperationDto) {
    const userOwnsPortfolio = await this.userModel.findOne({
      username,
      portfolios: addOperationDto.portfolioId,
    });
    if (!userOwnsPortfolio) throw new UnauthorizedException();

    const portfolio = await this.portfolioModel.findById(addOperationDto.portfolioId);

    const accountIndex = portfolio.accounts.findIndex((account) => account.id === addOperationDto.accountId);

    portfolio.accounts[accountIndex].cash += addOperationDto.amount;

    portfolio.ownContributionValue += addOperationDto.amount;

    portfolio.operationHistory.push({
      id: crypto.randomUUID(),
      accountName: portfolio.accounts[accountIndex].title,
      type: addOperationDto.amount < 0 ? 'withdraw' : 'deposit',
      amount: addOperationDto.amount,
      date: new Date(Date.now()),
    });

    if (portfolio.accounts[accountIndex].cash < 0) throw new BadRequestException();

    return this.portfolioModel.findByIdAndUpdate(addOperationDto.portfolioId, portfolio);
  }

  async deleteAccount(username, deleteAccountDto: DeleteAccountDto) {
    const userOwnsPortfolio = await this.userModel.findOne({
      username,
      portfolios: deleteAccountDto.portfolioId,
    });
    if (!userOwnsPortfolio) throw new UnauthorizedException();

    const portfolio = await this.portfolioModel.findById(deleteAccountDto.portfolioId);

    if (!portfolio) throw new BadRequestException();

    portfolio.accounts = portfolio.accounts.filter((account) => account.id !== deleteAccountDto.accountId);

    return this.portfolioModel.findByIdAndUpdate(deleteAccountDto.portfolioId, portfolio);
  }

  async deleteCategory(username, deleteCategoryDto: DeleteCategoryDto) {
    const userOwnsPortfolio = await this.userModel.findOne({
      username,
      portfolios: deleteCategoryDto.portfolioId,
    });
    if (!userOwnsPortfolio) throw new UnauthorizedException();

    const portfolio = await this.portfolioModel.findById(deleteCategoryDto.portfolioId);
    if (!portfolio) throw new BadRequestException();

    const categoryToDelete = portfolio.categories.find(
      (item) => item.category === deleteCategoryDto.categoryName,
    );
    if (!categoryToDelete || categoryToDelete.value > 0 || categoryToDelete.category === 'cash')
      throw new BadRequestException();

    portfolio.categories = portfolio.categories.filter(
      (category) => category.category !== deleteCategoryDto.categoryName,
    );

    return this.portfolioModel.findByIdAndUpdate(deleteCategoryDto.portfolioId, portfolio);
  }

  //! update

  async reevaluateAssets(username:string, portfolioId: string) {
    const userOwnsPortfolio = await this.userModel.findOne({ username, portfolios: portfolioId });
    if (!userOwnsPortfolio) throw new UnauthorizedException();

    const portfolio = await this.portfolioModel.findById(portfolioId);

    await this.handleAssetsUpdate(portfolio.assets, portfolio.currency);

    const reevaluatedPortfolio = this.reeavluateCategoriesAndTotalValue(portfolio);

    if(isDateOlderThanXHours(reevaluatedPortfolio.timeseriesValueLastUpdate,8)){

      this.portfolioTimeseriesService.addRecord(portfolio.id,portfolio.totalValue,portfolio.ownContributionValue)

      portfolio.timeseriesValueLastUpdate = new Date(Date.now())

    }


    await this.portfolioModel.findByIdAndUpdate(portfolioId, reevaluatedPortfolio);

    return portfolio;
  }

  private async handleAssetsUpdate(assets: Asset[], portfolioCurrency: CurrencyType) {
    //todo bondsPolishTreasuryIke = ...
    const bondsPolishTreasury = assets.filter((item) => item.type === 'bond_pltr') as AssetWithDay[];
    bondsPolishTreasury.forEach((item) => {
      item.day = new Date(item.date).getDate();
    });

    // }
    const tickers = assets.filter((item) => item.type === 'ticker');

    await Promise.all(
      tickers.map(async (asset) => {
        const currencyRate = await this.currenciesService.getCurrencyRate(asset.currency, portfolioCurrency);

        const price = (await this.tickerService.calculateOne(asset.name)).price;

        if (price && currencyRate) {
          asset.price = price * currencyRate;
          asset.originalCurrencyPrice = price;
        }
      }),
    );

    await this.bonds_pltrService.updateBondsMany(bondsPolishTreasury, false);

    console.log('done');
  }

  private reeavluateCategoriesAndTotalValue(
    portf: Document<unknown, {}, Portfolio> &
      Portfolio & {
        _id: Types.ObjectId;
      },
  ) {
    portf.categories.forEach((category) => (category.value = 0));
    portf.totalValue = 0;
    portf.freeCash = 0;

    portf.accounts.forEach((account) => {
      portf.freeCash += account.cash;
    });

    portf.assets.forEach((asset) => {
      const index = portf.categories.findIndex((category) => category.category === asset.category);
      if (index !== -1) portf.categories[index].value += asset.price * asset.quantity;
    });

    portf.categories.forEach((category) => (portf.totalValue += category.value));
    portf.totalValue += portf.freeCash;

    return portf;
  }
}
