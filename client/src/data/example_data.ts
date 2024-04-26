export const ASSETS = [

    {
      title: "XTB Rachunek Maklerski",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },

]

export const EXAMPLE_PORTFOLIO = {
title:"Długoterminowy",
currency:"PLN",
totalValue: 17123,
accounts:[
    {
        title:"Bossa DM",
        cash:1234,
        assets:[
            {
                title: "EDO2137",
                type: "bond",
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
                title: "VANGUARD FTSE ALL-WORLD ETF",
                type: "share",
                ticker: "VWRA.UK",
                quantity: "15",
                value:17123-9021,
                buyDate: Date.now(),

              },
            ]
    },
    
]



}