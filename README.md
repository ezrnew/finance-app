# Overview
 The idea behind this project is to keep track of all investments across various investing accounts in one place. This application is not intended for trading but for monitoring only. The main goal is simplicity - I want to make this app to have lots of features and QOL utilities while remaining easy to use. This application targets beginner and 'casual' investors rather than daily traders. 
#### Note that this application is still in early development phase.

#####
This project consists of frontend, backend and all the stock api - either calculated or scrapped. Application currently provides data for most assets listed on stock markets (those can be found via [tickers](https://en.wikipedia.org/wiki/Ticker_symbol)) and  [polish treasury bonds](https://www.obligacjeskarbowe.pl/). Data scraping is functional yet still under continuous improvement.

# Architecture
The following diagram shows how client is receiving up to date assets data (current price, etc.):

![asset architecture](https://raw.githubusercontent.com/ezrnew/finance-app/main/assets/asset-architecture.png "asset architecture")

- If there is no data for asset that user is looking for or it was updated more than 24 hours ago, the data is being scrapped from external source. If successful the data is updated in database & sent back to client.
- There are also "scheduled scrappers" which run at some time interval. They provide data that is neccessary for reevaluating assets such as  currency rates or  [cpi](https://en.wikipedia.org/wiki/Consumer_price_index) values (only polish atm).

# Portfolio
Portfolio is the main concept of this application where all the users' assets are stored. User can have multiple portfolios to keep investitions separated, although a single portfolio is enough access all features.

![example portfolio](https://raw.githubusercontent.com/ezrnew/finance-app/main/assets/example-portfolio.png "example portfolio")

### Features
- Portfolio has **one main currency** and all the assets are evaluated using current currency rates. In the above example value of vwra.uk, which is listed in USD, has been converted to PLN.
- Portfolio can have many user-defined investing **accounts** and **categories**. When buying a new asset, it must be assigned to both an account and a category.
- Accounts act like real investing accounts: you can deposit or withdraw money from them. After depositing   money, assets can be bought on this account (deposit can be skipped and will be handled automatically). **Note that this is simulated account and does not involve real money.** 
- Categories are displayed on a pie chart by their percentage value. Free cash available in investing accounts also counts as a category. 
- Portfolio's total value is equal to current price of all assets + free cash.
- All the assets with more detailed data are listed in the table.
- Portfolio also stores all **historical operations** including deposit/withdraw and buy/sell orders.
- Portfolio will also store it's historical percentage increase (or decrease) compared to CPI **(coming soon)**.


If a specific asset is not in the database users can add it manually by its ticker (only for [listed assets](https://www.investopedia.com/terms/l/listed.asp)). Scrapper will try to find asset with given name and if it succeds, the data is returned and saved in the database allowing every user can "buy" it.


![adding asset](https://raw.githubusercontent.com/ezrnew/finance-app/main/assets/add-new-assset-demo.gif "adding asset")

# Technologies
### Frontend
- Core: Typescript, React, Tailwind
- Most of the ui components (buttons etc.): Shadcn/ui
- Icons: Radix-ui/Font-awesome
- Charts: Recharts
- Tables: Tanstack-table
- State management: redux-toolkit
- Notifications: React-hot-toasts
- Translations: i18next
### Backend
- Core: Typescript, Nest.js, Express, REST
- Database: Mongodb
- User authentication & authorization: JWT tokens (OOTB nest.js module)
- Web scraping: Puppeteer
# Future plans
There are some key features that im currently prioritizing:
- Portolio historical value compared to CPI or other indexes
- Including taxes when selling assets or depositing money - and extending portfolios' accounts to have "tax modifiers" like polish IKE
- Preview assset historical prices 
- Dark mode
- Unit tests  (:



# Installation
install node modules in both client and nest-scrapper. Nest-scrapper also requires two config files in its root directory:

 .env
 ```
MONGODB_URI = YOUR_MONGODB_URI
 ```
 config.json
 ```
 { "jwtSecret": YOUR_JWT_SECRET }
 ```

Thats it!
