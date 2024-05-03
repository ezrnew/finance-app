import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('portfolios')
export class PortfoliosController {
    constructor(private readonly portfoliosService: PortfoliosService) {}



    @UseGuards(AuthGuard)
    @Post('create')
    async create(@Request() req,@Body() createPortfolioDto: CreatePortfolioDto){
       
        console.log("rdasddaeq",req.user)
        await this.portfoliosService.create(req.user.username,createPortfolioDto);

    }

}
