import { httpReqHandler } from "../httpHandler";

export class BackendConnectorSingleton {
  private httpRequest;

  constructor(baseUrl: string) {
    this.httpRequest = httpReqHandler(baseUrl);
  }

  async login(username: string, password: string) {
    const res = await this.httpRequest("/auth/login", "POST", {
      body: { username, password },
    });

    if (res?.ok) {
      const data = await res.json();
      console.log(data);
      return true;
    }

    return false;
  }

  async register(email: string, username: string, password: string) {
    const res = await this.httpRequest("/auth/register", "POST", {
      body: { email, username, password },
    });

    console.log("response", res);
    if (res?.ok) {
      return { success: true, error: "" };
    }

    const error = await res?.json();

    return { success: false, error: error.message as string };
  }

  async getAllAssetNames() {
    const res = await this.httpRequest("/instruments");

    if (res?.ok) {
      return res.json();
    }
  }

  async getAllPortfolios() {
    const res = await this.httpRequest("/portfolios");

    if (res?.ok) {
      return res.json();
    }
    return false;
  }

  async getPortfolioById(id: string) {
    const res = await this.httpRequest(`/portfolios/${id}`);

    if (res?.ok) {
      return res.json();
    }
    return false;
  }

  async createNewPortfolio(name: string, currency: string) {
    const res = await this.httpRequest("/portfolios/create", "POST", {
      body: { name, currency },
    });

    if (res?.ok) {
      return true;
    }
    return false;
  }

  async addNewAccount(portfolioId: string, name: string) {
    const res = await this.httpRequest("/portfolios/addAccount", "POST", {
      body: { portfolioId, name },
    });

    if (res?.ok) {
      return true;
    }
    return false;
  }

  async addNewCategory(portfolioId: string, name: string) {
    const res = await this.httpRequest("/portfolios/addCategory", "POST", {
      body: { portfolioId, name },
    });

    if (res?.ok) {
      return true;
    }
    return false;
  }

  async buyAsset(
    portfolioId: string,
    category: string,
    accountId: string,
    asset: { name: string; type: string },
    date: Date,
    currency: string,
    currencyRate: number,
    price: number,
    quantity: number,
    paymentAdded: boolean,
  ) {
    const res = await this.httpRequest("/portfolios/buyAsset", "POST", {
      body: {
        portfolioId,
        category,
        accountId,
        asset,
        date,
        currency,
        currencyRate,
        price,
        quantity,
        paymentAdded,
      },
    });

    if (res?.ok) {
      return true;
    }
    return false;
  }

  async sellAsset(
    portfolioId: string,
    assetId: string,
    category: string,
    accountId: string,
    quantityToSell: number,
  ) {
    const res = await this.httpRequest("/portfolios/sellAsset", "POST", {
      body: { portfolioId, category, accountId, assetId, quantityToSell },
    });

    if (res?.ok) {
      return true;
    }
    return false;
  }

  async reevaluateAssets(portfolioId: string) {
    const res = await this.httpRequest("/portfolios/reevaluate", "POST", {
      body: { portfolioId },
    });

    if (res?.ok) {
      return res.json();
    }
    return false;
  }

  async addOperation(portfolioId: string, accountId: string, amount: number) {
    const res = await this.httpRequest("/portfolios/operation", "POST", {
      body: { portfolioId, accountId, amount },
    });

    if (res?.ok) {
      return true;
    }
    return false;
  }

  async findTicker(ticker: string) {
    const res = await this.httpRequest(`/tickers/add/${ticker}`);

    if (res?.ok) {
      return res.json();
    }
    return false;
  }

  async deleteAccount(portfolioId: string, accountId: string) {
    const res = await this.httpRequest("/portfolios/account", "DELETE", {
      body: { portfolioId, accountId },
    });

    if (res?.ok) {
      return true;
    }
    return false;
  }

  async deleteCategory(portfolioId: string, categoryName: string) {
    const res = await this.httpRequest("/portfolios/category", "DELETE", {
      body: { portfolioId, categoryName },
    });

    if (res?.ok) {
      return true;
    }
    return false;
  }


  async getPortfolioTimeseries(portfolioId: string, from: Date,to:Date) {
    


    const queryString = new URLSearchParams({
      portfolioId: portfolioId,
      from: from.toISOString(),  
      to: to.toISOString()
    }).toString();


    const res = await this.httpRequest(`/portfolios-timeseries?${queryString}`);

    if (res?.ok) {
      return res.json();
    }
    return false;
  }



}

export const server = new BackendConnectorSingleton("http://localhost:2137");
