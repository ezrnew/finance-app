import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../security/auth/auth.guard';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfoliosService } from './portfolios.service';
import { AddAccountDto } from './dto/add-account.dto';
import { AddCategoryDto } from './dto/add-category.dto';
import { BuyAssetDto } from './dto/buyAssetDto';
import { SellAssetDto } from './dto/sell-asset-dto';
import { UpdateAssetsDto } from './dto/update-assets-dto';
import { AddOperationDto } from './dto/add-operation.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAll(@Request() req) {
    return this.portfoliosService.getAll(req.user.username);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Request() req, @Param() params: { id: string }) {
    if (!params.id) throw new BadRequestException();

    return this.portfoliosService.getById(req.user.username, params.id);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Request() req, @Body() createPortfolioDto: CreatePortfolioDto) {
    await this.portfoliosService.create(req.user.username, createPortfolioDto);
  }

  @UseGuards(AuthGuard)
  @Post('addAccount')
  async addAccount(@Request() req, @Body() addAccountDto: AddAccountDto) {
    await this.portfoliosService.addAccount(req.user.username, addAccountDto.portfolioId, addAccountDto.name);
  }

  @UseGuards(AuthGuard)
  @Post('addCategory')
  async addCategory(@Request() req, @Body() addCategoryDto: AddCategoryDto) {
    await this.portfoliosService.addCategory(
      req.user.username,
      addCategoryDto.portfolioId,
      addCategoryDto.name,
    );
  }

  @UseGuards(AuthGuard)
  @Post('buyAsset')
  async buyAsset(@Request() req, @Body() buyAssetDto: BuyAssetDto) {
    const result = await this.portfoliosService.buyAsset(req.user.username, buyAssetDto);

    if (!result) throw new BadRequestException();
  }

  @UseGuards(AuthGuard)
  @Post('sellAsset')
  async sellAsset(@Request() req, @Body() sellAssetDto: SellAssetDto) {
    const result = await this.portfoliosService.sellAsset(req.user.username, sellAssetDto);

    if (!result) throw new BadRequestException();
  }

  @UseGuards(AuthGuard)
  @Post('reevaluate')
  async updateAssets(@Request() req, @Body() updateAssetsDto: UpdateAssetsDto) {
    const result = await this.portfoliosService.reevaluateAssets(
      req.user.username,
      updateAssetsDto.portfolioId,
    );

    if (!result) throw new BadRequestException();
    return result;
  }

  @UseGuards(AuthGuard)
  @Post('operation')
  async addOperation(@Request() req, @Body() addOperationDto: AddOperationDto) {
    await this.portfoliosService.addAccountOperation(req.user.username, addOperationDto);
  }

  @UseGuards(AuthGuard)
  @Delete('account')
  async deleteAccount(@Request() req, @Body() deleteAccountDto: DeleteAccountDto) {
    await this.portfoliosService.deleteAccount(req.user.username, deleteAccountDto);
  }

  @UseGuards(AuthGuard)
  @Delete('category')
  async deleteCategory(@Request() req, @Body() deleteCategoryDto: DeleteCategoryDto) {
    await this.portfoliosService.deleteCategory(req.user.username, deleteCategoryDto);
  }

//todo nowe

  // @UseGuards(AuthGuard)
  // @Delete('cpi')
  // async getPortfolioCpiRate(@Request() req, @Body() deleteCategoryDto: DeleteCategoryDto) {
  //   // await this.portfoliosService.deleteCategory(req.user.username, deleteCategoryDto);
  // }
}
