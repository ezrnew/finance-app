import React, { useState } from 'react'
import { Button } from '../ui/button'
import { CircleCheck, PlusCircle, XCircle } from 'lucide-react'
import { Input } from '../ui/input'
import { server } from '@/connection/backend/backendConnectorSingleton'

interface Props{
   portfolios:{id:string,title:string}[] 
   setPortfolioId:React.Dispatch<React.SetStateAction<string>>
}

export const PortfolioSidebar = ({portfolios,setPortfolioId}:Props) => {

    const [newPortfolioName, setNewPortfolioName] = useState('')
    const [isCreatingNew, setIsCreatingNew] = useState(false)
    const [newPortfolioError, setNewPortfolioError] = useState('')


    const submitNewPortfolio = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()

        const existingPortfolio = portfolios.find(item => item.title.toUpperCase()===newPortfolioName.toUpperCase())

        if(existingPortfolio){setNewPortfolioError('Portfolio with this name already exists!');return}

        const result = await server.createNewPortfolio(newPortfolioName)
        
    }



    console.log('tworze se nowy',isCreatingNew)

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
  {portfolios.map(item => <li onClick={()=>{setPortfolioId(item.id)}}    key={item.id}>{item.title}</li>)}
</ul>
</div>
  )
}
