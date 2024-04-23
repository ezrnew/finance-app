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

    // const res = await fetch('http://localhost:2137/auth/login', {
    //     method: "POST",
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       username,
    //       password
    //     })
    //   });

    //   if (res.ok) {
    //     // Parse the response body as JSON
    //     const data = await res.json();
    //     console.log(data); 

    //   }
// console.log("RES",res)
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
}

export const server = new BackendConnectorSingleton("http://localhost:2137");
