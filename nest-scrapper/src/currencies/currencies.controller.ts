import { Controller, Get, Query } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';

@Controller('currencies')
export class CurrenciesController {
    constructor(private readonly currenciesService: CurrenciesService) {}

    @Get()
    async getRate(@Query('from') from: string,@Query('to') to: string): Promise<any> {
        //todo type validation
        console.log("huj",from,to)
        //@ts-ignore
      return this.currenciesService.getCurrencyRate(from,to);
    }

}
