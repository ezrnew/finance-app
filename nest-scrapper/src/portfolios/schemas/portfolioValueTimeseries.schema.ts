import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Asset } from 'src/common/types/portfolioAsset.type';
import { CurrencyType } from 'src/general/currencies/schema/currencyRate.schema';

export type PortfolioDocument = HydratedDocument<PortfolioValueTimeseries>;

@Schema({
    collection:"portfolio-value-timeseries",
    
    timeseries:{
        timeField:'timestamp',
        metaField:'portfolioId',
        granularity:"hours"

    }
})
export class PortfolioValueTimeseries {
  @Prop()
  readonly value: number;
  
  @Prop()
  readonly ownContribution:number
  
  @Prop()
  readonly timestamp: Date

  @Prop()
  readonly portfolioId:string
 



}

export const PortfolioValueTimeseriesSchema = SchemaFactory.createForClass(PortfolioValueTimeseries);
