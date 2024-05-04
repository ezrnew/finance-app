import t from "react-hot-toast";


// export const createdPortfolioToast = () =>{
// return toast.success("dzienki")
// }

export class Toast{

    portfolioCreated(){
        return t.success('Portfolio created')
    }
}

export const toast = new Toast()