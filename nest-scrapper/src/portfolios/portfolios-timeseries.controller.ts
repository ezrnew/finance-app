import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '../security/auth/auth.guard';
import { getPortfolioTimeseriesDto } from './dto/get-timeseries.dto';
import { PortfoliosTimeseriesService } from './portfoliosTimeseries.service';

@Controller('portfolios-timeseries')
export class PortfoliosTimeseriesController {
  constructor(private readonly portfoliosTimeseriesService: PortfoliosTimeseriesService) {}


  //todo check if jwt user owns portfolio -> PortfolioGuard?
  @UseGuards(AuthGuard)
  @Get()
  async getValuesForPortfolio(@Query() dto:getPortfolioTimeseriesDto) {


    return this.portfoliosTimeseriesService.getValuesForPortfolio(dto);
  }

}
