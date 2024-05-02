export const ASSETS = [

    {
      title: "XTB Rachunek Maklerski",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },

]

export const PORTFOLIOS = [
  {id:1,title:"Długoterminowy"},
  {id:2,title:"Inny"},
]


export const EXAMPLE_PORTFOLIO = {
    id:1,
title:"Długoterminowy",
currency:"PLN",
totalValue: 17123,
categories:[{category:'shares',value:8102},{category:'bonds',value:9021}],
accounts:[
    {
        title:"Bossa DM",
        cash:1234,
        assets:[
            {
                title: "EDO2137",
                type: "bonds",
                quantity: "80",
                value: 9021,
                buyDate: Date.now(),
              },
            ]
    },
    {
        title:"XTB Rachunek Maklerski",
        cash:0,
        assets:[
            {
                title: "VANGUARD FTSE ALL-WORLD UCITS ETF",
                type: "shares",
                ticker: "VWRA.UK",
                quantity: "15",
                value:8102,
                buyDate: Date.now(),

              },
            ]
    },
    
]



}



export const pieChartData =
[
    {
      "name": "Produced Wind Energy",
      "value": 400
    },
    {
      "name": "Purchased Wind Energy",
      "value": 300
    },
    {
      "name": "Produced Solar Energy",
      "value": 300
    },
    {
      "name": "Purchased Solar Energy",
      "value": 200
    },

  ];
