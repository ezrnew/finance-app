import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { CircleCheck, PlusCircle, XCircle } from 'lucide-react'
import { Input } from '../ui/input'
import { server } from '@/connection/backend/backendConnectorSingleton'
import { toast } from '@/utils/toasts'
import { useActions, useTypedSelector } from '@/hooks/use-redux'
import { ls } from '@/utils/localStorage'

// interface Props{
//   //  portfolios:{id:string,title:string}[] 
//    setPortfolioId:React.Dispatch<React.SetStateAction<string>>
// }

export const PortfolioSidebar = () => {

  const {availablePortfolios,currentPortfolioId} = useTypedSelector(state =>state.portfolio)
  const {setAvailablePortfolios,setCurrentPortfolioId,setCurrentPortfolio} = useActions()


    const [newPortfolioName, setNewPortfolioName] = useState('')
    const [isCreatingNew, setIsCreatingNew] = useState(false)
    const [newPortfolioError, setNewPortfolioError] = useState('')
    const [_,refetch] = useState(false)

    useEffect(() => {


      const fetchAllPortfolios = async()=>{//todo fetch only titles & ids
        console.log("feczuje")
        const portfolios = await server.getAllPortfolios()
        console.log("portf",portfolios)

        setAvailablePortfolios(portfolios) 
      } 

     fetchAllPortfolios()

      // setAvailablePortfolios('PORTFOLIOS')//fetch
    }, [_])

    
    useEffect(() => {


      const getPortfolioData = async()=>{
        console.log("feczuje")
        const portfolio = await server.getPortfolioById(currentPortfolioId)
        // console.log("pppppppp",portfolio)

        setCurrentPortfolio(portfolio) 


        const portfolioWithReevaluatedValues = await server.reevaluateAssets(currentPortfolioId)
        // setCurrentPortfolio(portfolioWithReevaluatedValues) 
      } 

      getPortfolioData()
    }, [currentPortfolioId])



    const submitNewPortfolio = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()

        const existingPortfolio = availablePortfolios.find(item => item.title.toUpperCase()===newPortfolioName.toUpperCase())

        if(existingPortfolio){setNewPortfolioError('Portfolio with this name already exists!');return}

        const result = await server.createNewPortfolio(newPortfolioName)

        if(!result) {setNewPortfolioError("cannot create portfolio");return}

        setIsCreatingNew(false)
        setNewPortfolioName('')
        toast.portfolioCreated()
        
        refetch(item=>!item)
        
    }


  return (
    <div className="max-w-60 xl:w-full w-52 bg-neutral-50 hidden md:block p-4 ">


{
    !isCreatingNew ?<div className="flex justify-between">
    <p className="text-lg font-semibold my-auto">Portfolios</p>
    <Button onClick={()=>{setIsCreatingNew(true)}} variant="ghost" size="icon">
      <PlusCircle />
    </Button>
  </div>:
  <div>

  <form onSubmit={submitNewPortfolio} className='flex justify-between space-x-2'>
    <Input value={newPortfolioName} onChange={(e)=>{setNewPortfolioName(e.target.value)}}  placeholder='Name'/>

    <div className='flex space-x-1'>
    <button>
    <CircleCheck className='text-green-500 hover:text-green-600'/>

    </button>
    <button type='button' onClick={()=>{setIsCreatingNew(false);setNewPortfolioError('')}} >
        <XCircle className='text-red-500 hover:text-red-600'/>
    </button>
    </div>
  </form>
  <p className="text-red-500 font-medium pb-2">{newPortfolioError}</p>

  </div>
}



<div className="h-[1px]  my-1 w-full bg-gray-200" />

<ul className="flex flex-col py-2 font-semibold">
  {availablePortfolios.map(item => <li onClick={()=>{setCurrentPortfolioId(item._id);ls.setPortfolioId(item._id)}}    key={item._id}>{item.title}</li>)}
</ul>
</div>
  )
}
