const portfolioId = 'portfolioId'

 class LocalStorage{

    setPortfolioId(id:string){
        localStorage.setItem(portfolioId,id)
    }
    getPortfolioId(){
        return localStorage.getItem(portfolioId)
    }

}

export const ls = new LocalStorage()