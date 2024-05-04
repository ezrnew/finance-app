import { BadRequestException, Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfoliosService } from './portfolios.service';
import { AddAccountDto } from './dto/add-account.dto';
import { AddCategoryDto } from './dto/add-category.dto';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAll(@Request() req) {
    console.log('rdasddaeq', req.user);
    return this.portfoliosService.getAll(req.user.username);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Request() req,@Param() params: {id:string}) {

    console.log("ajdik",params.id)
    if (!params.id) throw new BadRequestException()



    console.log('rdasddaeq', req.user);
    return this.portfoliosService.getById(req.user.username,params.id);
  }


  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Request() req, @Body() createPortfolioDto: CreatePortfolioDto) {
    console.log('rdasddaeq', req.user);
    await this.portfoliosService.create(req.user.username, createPortfolioDto);
  }



  @UseGuards(AuthGuard)
  @Post('addAccount')
  async addAccount(@Request() req,@Body() addAccountDto:AddAccountDto) {
    console.log('rdasddaeq', req.user);
    await this.portfoliosService.addAccount(req.user.username,addAccountDto.portfolioId,addAccountDto.name);
  }

  @UseGuards(AuthGuard)
  @Post('addCategory')
  async addCategory(@Request() req,@Body() addCategoryDto:AddCategoryDto) {
    console.log('rdasddaeq', req.user);
    await this.portfoliosService.addCategory(req.user.username,addCategoryDto.portfolioId,addCategoryDto.name);

  }

}
