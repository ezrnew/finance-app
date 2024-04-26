
export  const currencyToIntlZone = {
    PLN:"pl-PL",
    GBP:"en-GB"

} 

export type CurrencyType = keyof typeof currencyToIntlZone; 

export function formatCurrency(zone:string,amount:number,currency:string){

    
   return (new Intl.NumberFormat(zone, {
        currency,
        style: "currency",
        maximumFractionDigits: 0
    })).format(amount)
    
}


export function formatDateShort(zone:string,date:Date){

    
    return (new Intl.DateTimeFormat(zone, {
         day:"numeric",month:"short",year:"numeric"
     })).format(date)
     
 }
 