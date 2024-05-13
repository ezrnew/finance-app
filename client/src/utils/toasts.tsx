import t from "react-hot-toast";


// export const createdPortfolioToast = () =>{
// return toast.success("dzienki")
// }

export class Toast{

    portfolioCreated(){
        return t.success('Portfolio created')
    }
    scrappingNewTicker(promise:Promise<any>){
        return t.promise(promise,{loading:'Trying to find data...',success:<b>Asset has been successfully added</b>,error:<b>Asset already exist</b>})
    }
    operationSuccessful(){
        return t.success('Operation successful')
    }
    buyOperationFailure(){
        return t.error('Cannot buy asset')
    }
    sellOperationFailure(){
        return t.error('Cannot sell asset')
    }

    updatingPortfolioData(promise:Promise<any>){
        return t.promise(promise,{loading:'Updating portfolio data',success:<b>Update finished</b>,error:<b>Cannot update</b>},{position:'bottom-right'})
    }

}

export const toast = new Toast()