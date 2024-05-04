import { httpReqHandler } from "../httpHandler";

export class BackendConnectorSingleton {
  private httpRequest;

  constructor(baseUrl: string) {
    this.httpRequest = httpReqHandler(baseUrl);
  }

  async login(username: string, password: string) {
    const res = await this.httpRequest("/auth/login", "POST", { body: { username, password } });

    if(res?.ok){
        const data = await res.json();
        console.log(data)
        //todo set jwt
        return true
    }


    return false

  }

  async register(email:string,username: string, password: string) {
    const res = await this.httpRequest("/auth/register", "POST", { body: {email, username, password } });

    console.log("response",res)
    if(res?.ok){
  
        return {success:true,error:''}
    }

    const error = await res?.json();
    
    //todo types
    return {success:false,error:error.message as string}


  }

  async getAllAssetNames(){
    const res = await this.httpRequest("/assets")

    if(res?.ok){
      return res.json()
  }
}

async getAllPortfolios(){
  const res = await this.httpRequest("/portfolios")

  if(res?.ok){
    return res.json()
}
return false
}

async getPortfolioById(id:string){
  const res = await this.httpRequest(`/portfolios/${id}`)

  if(res?.ok){
    return res.json()
}
return false
}


async createNewPortfolio(name:string){
  const res = await this.httpRequest("/portfolios/create",'POST',{body:{name}})

  if(res?.ok){
    return true
}
return false
}




async addNewAccount(portfolioId:string,name:string){
  const res = await this.httpRequest("/portfolios/addAccount",'POST',{body:{portfolioId,name}})

  if(res?.ok){
    return true
}
return false
}

async addNewCategory(portfolioId:string,name:string){
  const res = await this.httpRequest("/portfolios/addCategory",'POST',{body:{portfolioId,name}})

  if(res?.ok){
    return true
}
return false
}


}

export const server = new BackendConnectorSingleton("http://localhost:2137");
