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
import { CurrenciesService } from '../currencies/currencies.service';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { CurrencyType } from 'src/currencies/schema/currencyRate.schema';
import { DeleteCategoryDto } from './dto/delete-category.dto';

@Injectable()
export class PortfoliosService {
  private readonly _logger = new Logger(PortfoliosService.name);

  constructor(
    @InjectModel(Portfolio.name) private portfolioModel: Model<Portfolio>,
    @InjectModel(User.name) private userModel: Model<User>,
    private bonds_pltrService: BondsPolishTreasuryService,
    private tickerService: TickersService,
    private currenciesService: CurrenciesService,
  ) {}

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

      account.assets.forEach((asset) => {
        const index = portf.categories.findIndex((category) => category.category === asset.category);
        if (index !== -1) portf.categories[index].value += asset.price * asset.quantity;
      });
    });

    portf.categories.forEach((category) => (portf.totalValue += category.value));
    portf.totalValue += portf.freeCash;

    return portf;
  }

  private async handleAssetUpdate(asset: any, portfolioCurrency: CurrencyType) {
    const currencyRate = await this.currenciesService.getCurrencyRate(asset.currency, portfolioCurrency);
    // console.log("currency rate:",currencyRate,asset.currency,portfolioCurrency)

    if (asset.type === 'bond_pltr') {
      const bondValue = await this.bonds_pltrService.handleBond(asset.name);
      let bondResult: number | undefined;
      //@ts-ignore //todo fix
      if (bondValue) bondResult = asset.buyPrice * bondValue; //?
      return [bondResult, currencyRate];
    }
    if (asset.type === 'tickers') {
      const tickerResult = (await this.tickerService.calculateOne(asset.name)).price;
      return [tickerResult, currencyRate];
    }

    this._logger.warn('RETURNING INVALID DATA');
    return [];
  }

  async reevaluateAssets(username, portfolioId: string) {
    const userOwnsPortfolio = await this.userModel.findOne({ username, portfolios: portfolioId });
    if (!userOwnsPortfolio) throw new UnauthorizedException();

    const portfolio = await this.portfolioModel.findById(portfolioId);

    const promises = portfolio.accounts.map(async (account) => {
      await Promise.all(
        account.assets.map(async (asset) => {
          const [price, currencyRate] = await this.handleAssetUpdate(asset, portfolio.currency);
          if (price && currencyRate) {
            asset.price = price * currencyRate;
            asset.originalCurrrencyPrice = price;
          }
        }),
      );
    });
    await Promise.all(promises);

    const reevaluatedPortfolio = this.reeavluateCategoriesAndTotalValue(portfolio);

    await this.portfolioModel.findByIdAndUpdate(portfolioId, reevaluatedPortfolio);

    return reevaluatedPortfolio;
  }

  async create(username, createPortfolioDto: CreatePortfolioDto) {
    const user = await this.userModel.findOne({ username });

    const newPortfolio = new this.portfolioModel({
      title: createPortfolioDto.name,
      currency: createPortfolioDto.currency,
      totalValue: 0,
      operationHistory: [],
      categories: [],
      accounts: [],
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

    portfolio.accounts.push({ id: crypto.randomUUID(), title: name, cash: 0, assets: [] });
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

    const totalPrice = buyAssetDto.price * buyAssetDto.quantity;

    portfolio.totalValue += totalPrice;

    const portfolioCategory = portfolio.categories.find((item) => item.category === buyAssetDto.category);

    if (!portfolioCategory) return false;

    portfolioCategory.value += totalPrice;

    const selectedIndex = portfolio.categories.findIndex((item) => item.category === buyAssetDto.category);

    portfolio.categories[selectedIndex] = portfolioCategory;

    const portfolioAccount = portfolio.accounts.find((item) => item.title === buyAssetDto.account);

    if (!portfolioAccount) return false;

    if (!buyAssetDto.paymentAdded) portfolioAccount.cash -= totalPrice;

    if (portfolioAccount.cash < 0) return false;

    portfolioAccount.assets.push({
      id: crypto.randomUUID(),
      name: buyAssetDto.asset.name,
      type: buyAssetDto.asset.type,
      category: buyAssetDto.category,
      freeCash: 0,

      date: buyAssetDto.date,
      currency: buyAssetDto.currency,
      currencyRate: buyAssetDto.currencyRate, //?potrzebne?
      buyPrice: buyAssetDto.price,
      price: buyAssetDto.price,
      originalCurrrencyPrice: buyAssetDto.price,
      originalCurrrencyBuyPrice: buyAssetDto.price,
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

    const selectedIndex2 = portfolio.accounts.findIndex((item) => item.title === buyAssetDto.account);

    portfolio.accounts[selectedIndex2] = portfolioAccount;

    return portfolio.save();
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

    const portfolioAccount = portfolio.accounts.find((item) => item.title === sellAssetDto.account);

    if (!portfolioAccount) return false;

    const accountIndex = portfolio.accounts.findIndex((item) => item.title === sellAssetDto.account);

    const { ...sellItem } = portfolio.accounts[accountIndex].assets.find(
      (item) => item.id === sellAssetDto.assetId,
    );

    const sellItemIndex = portfolio.accounts[accountIndex].assets.findIndex(
      (item) => item.id === sellAssetDto.assetId,
    );

    sellItem.quantity = sellItem.quantity - sellAssetDto.quantityToSell;

    if (sellItem.quantity <= 0) {
      portfolio.accounts[accountIndex].assets = portfolio.accounts[accountIndex].assets.filter(
        (item) => item.id !== sellAssetDto.assetId,
      );
    } else {
      portfolio.accounts[accountIndex].assets[sellItemIndex].quantity =
        portfolio.accounts[accountIndex].assets[sellItemIndex].quantity - sellAssetDto.quantityToSell;
    }

    portfolio.categories[categoryIndex].value -= sellAssetDto.quantityToSell * sellItem.price;

    portfolio.freeCash += sellAssetDto.quantityToSell * sellItem.price;

    portfolio.accounts[accountIndex].cash += sellAssetDto.quantityToSell * sellItem.price;

    portfolio.operationHistory.push({
      id: crypto.randomUUID(),
      accountName: portfolioAccount.title,
      type: 'sell',
      amount: sellAssetDto.quantityToSell * sellItem.price,
      date: new Date(Date.now()),
      asset: portfolio.accounts[accountIndex].assets[sellItemIndex],
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
}
