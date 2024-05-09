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

}

export const toast = new Toast()