import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PortfolioValueTimeseries } from './schemas/portfolioValueTimeseries.schema';
import { Portfolio } from './schemas/portfolio.schema';
import { getPortfolioTimeseriesDto } from './dto/get-timeseries.dto';

@Injectable()
export class PortfoliosTimeseriesService {
  constructor(
    @InjectModel(PortfolioValueTimeseries.name)
    private portfolioTimeseriesModel: Model<PortfolioValueTimeseries>,
  ) {}

  async addRecord(portfolioId: string, totalValue: number, ownContributionValue: number) {
    const newRecord = new this.portfolioTimeseriesModel({
      portfolioId,
      value: totalValue.toFixed(2),
      ownContribution: ownContributionValue.toFixed(2),
      timestamp: new Date(Date.now()),
    });
    return newRecord.save();
  }

  async getValuesForPortfolio(dto: getPortfolioTimeseriesDto) {
    return this.portfolioTimeseriesModel.find({
      portfolioId: dto.portfolioId,
      timestamp: {
        $gte: dto.from,
        $lte: dto.to,
      },
    });
  }
}
