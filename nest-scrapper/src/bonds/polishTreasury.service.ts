import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CPIService } from '../general/cpi/cpi.service';
import { getMonthNumberBefore, getMonthShortNameByNumber, monthNumber, validateOlderMonth } from '../utils/date.utils';
import { Model } from 'mongoose';
import { Cpi } from '../general/cpi/schemas/cpi.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Coi, Edo } from './schemas/bonds.polishTreasury';
import { addPercentageRate, calculateCummulatedRate, calculateYearRateByDaysPassed } from '../utils/math.utils';

//stalokuponowe
//oprocentowane stopa refer
//indeksowane inflacja
@Injectable()
export class PolishTreasury {
  //   constructor(private readonly cpiService: CPIService) {}
  constructor(@InjectModel(Cpi.name) private cpiModel: Model<Cpi>,
  @InjectModel(Edo.name) private edoModel: Model<Edo>,
  @InjectModel(Coi.name) private coiModel: Model<Coi>,
) {}

  private readonly logger = new Logger(PolishTreasury.name);
  private readonly bondTypes = {
    fixed:[
      {id:'OTS',length:3},//todo hardcode this in months in handler
      {id:'TOS', length:3}
    ],
    reference:[
      {id:'ROR', length:1},
      {id:'DOR', length:2}
    ],
    cpi:[
      {id:'COI', length:4},
      {id:'ROS', length:6},
      {id:'EDO', length:10},
      {id:'ROD', length:12},
    ]


  } as const

  async handleBond(bondString: string,day?:number) {
    //todo validate dayOfMonth
    const dayOfMonth = day || 1
    console.log("dobry dzien",dayOfMonth)

    const result = this.validateBond(bondString);
    if (!result) return false;

    const { type, month, year } = result;
    console.log('RESULT', type, month, year);


    const {kind,lengthInYears} = this.getBondData(type)
    
    if(kind === "cpi"){
      return await this.calculateCpiIndexed(bondString,lengthInYears,dayOfMonth,month,year)
    }

    if(kind === "reference"){
      //todo implement
      return 2137
    }
    if(kind === "fixed"){
      // todo implement
      return 2137
    }



    //todo type SOLID
  }





  private async calculateCpiIndexed(bondString:string,lengthInYears:number,dayOfMonth:number,month: number, endYear: number) {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() - 2000;
    const currentMonth = currentDate.getMonth() + 1;
    const currentDayOfMonth = currentDate.getDate();

    const startDate = new Date(endYear+2000-lengthInYears,month-1,dayOfMonth)
    const endDate = new Date(endYear+2000,month-1,dayOfMonth)
    console.log("STARTDATE",startDate.toLocaleDateString())


    //todo add validation before getRate function
    //cannot evaluate bonds starting in future
    if(currentDate<startDate){
      console.log("futura ")
      return false
    }

    
    // let monthShortName = getMonthShortNameByNumber(month as monthNumber)
    const cpiMonth = getMonthShortNameByNumber(getMonthNumberBefore(month,2) as monthNumber)
    // console.log("CPI",cpiMonth)
    
    let query:any = {}
    let endYearFull = endYear+2000
    //todo are dates 100% correct?
    if (endDate > currentDate) {
      query.year = { $gt: endYearFull - lengthInYears };
    } else {
      query.year = { $gte: endYearFull+1 - lengthInYears, $lt: endYearFull };
    }

    /* EDO VALUES */
    const edoValues = await this.edoModel.findOne({ id: bondString.toUpperCase()})

    if (!edoValues){
      this.logger.warn("cant get data for "+bondString)
      return false
    }
    const {firstYear,margin} = edoValues
    console.log("EDO VALS",firstYear,margin)
    /* EDO VALUES */



    const cpiArrayQuery = await this.cpiModel.find(query)
    console.log("CPIPLS",cpiArrayQuery)
    const cpiArrayUnfiltered = []
    cpiArrayQuery.forEach(item =>{
      cpiArrayUnfiltered.push(item[cpiMonth])
    })

    
    const cpiArray =cpiArrayUnfiltered.filter(n=>n)
    
    console.log("CPI ARRAY",cpiArray)

    //
    if(cpiArray.length===0){
        //NO DATA FOR CPI,RETURN CURRENT NON-FULL YEAR
        return calculateYearRateByDaysPassed(100,firstYear,new Date(endYear+2000-lengthInYears,month-1,dayOfMonth))
      }
    
    const lastCpi = {year:cpiArrayQuery[cpiArrayQuery.length-1].year, month:cpiArrayQuery[cpiArrayQuery.length-1][cpiMonth]}
    console.log("OSTATNI WYNIK CPI",lastCpi)
    


    const cpiPlusMargin = cpiArray.map(item => item<0 ? 0+margin : item+margin)




  //PREPARE DATA
  console.log("curr month i monthliczony",currentMonth,month-2)

  
  // if(validateOlderMonth(currentMonth,month-2)){
  //   console.log("obecny jest starszy niż EDO")
  // }
  // if(month)
let lastRate
//zarówno w przypadku jak znana jak i nieznana popuje bo muszę wyliczyć niecały rok za ostatnią
    if(endDate > currentDate/* && lastCpi.month!=null*/){
      console.log("jezeli rok wiekszy")
      lastRate =cpiPlusMargin.pop()
    // console.log("popek",popek)
    }


    console.log("CPI PLUS MARG",cpiPlusMargin)

    //CALCULATE
    let years = lengthInYears
    
    let returnRate = 100

    console.log("lastRate",lastRate)
    
    returnRate = addPercentageRate(returnRate,firstYear)
    years = years-1
    console.log("after first year:",returnRate)

    returnRate = calculateCummulatedRate(returnRate,cpiPlusMargin.length,cpiPlusMargin)
    years= years-cpiPlusMargin.length

    if(endDate > currentDate){
      returnRate=calculateYearRateByDaysPassed(returnRate,lastRate,new Date(endYear+2000-years,month-1,dayOfMonth))
    }

    console.log("pozostalo lat:",years)

    console.log("return rate:",returnRate)

    return 3


  }




  private validateBond(bondString: string) {
    if (bondString.length != 7) {
      console.log('invalid length');
      return false;
    }

    const availableTypes = ['ROR', 'DOR', 'TOS', 'COI', 'EDO', 'ROS', 'ROD'];

    const type = bondString.slice(0, 3).toUpperCase();
    const month = parseInt(bondString.slice(3, 5)); // "04"
    const year = parseInt(bondString.slice(5, 7)); // "34"

    if (
      !availableTypes.includes(type) ||
      isNaN(month) ||
      !(month >= 1 && month <= 12) ||
      isNaN(year) ||
      year < 20 //todo currently no support for older ones
    ) {
      console.log('invalid type',month,year);
      return false;
    }

    return { type, month, year };
  }

  private getBondData(type:string){

    let bondData: {id:string,length:number};
    let bondRate:  'fixed' | 'reference' | 'cpi';

    for (const key in this.bondTypes) {
      if (Object.prototype.hasOwnProperty.call(this.bondTypes, key)) {
        const array = this.bondTypes[key];
        bondData = array.find(item => item.id === type);
        if (bondData) {
          bondRate = key as typeof bondRate;
          break;
        }
      }
    }


    return {kind:bondRate, lengthInYears:bondData.length}
  }

}
