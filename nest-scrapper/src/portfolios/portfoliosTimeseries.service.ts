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
      timestamp: new Date(),
    });
    return newRecord.save();
  }

  async getValuesForPortfolio(dto: getPortfolioTimeseriesDto) {
    return this.portfolioTimeseriesModel.aggregate([
      {
        $match: {
          portfolioId: dto.portfolioId,
          timestamp: {
            $gte: new Date(dto.from),
            $lte: new Date(dto.to),
          },
        },
      },
      {
        $project: {
          timestamp: { $toLong: '$timestamp' },
          portfolioId: 1,
          ownContribution: 1,
          value: 1,
        },
      },
    ]);
  }
}
