import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { server } from "@/connection/backend/backendConnectorSingleton";
import { EXAMPLE_PORTFOLIO } from "@/data/example_data";
import { useState } from "react";
import { useNavigate } from "react-router-dom";




export const ToolsPage = () => {

  const [tickerSearch,setTickerSearch] = useState('')
  const [loading,setLoading] = useState(false)

  const submitFindTicker =async  (e: React.FormEvent<HTMLFormElement>) =>{
e.preventDefault()

setLoading(true)

const result = await server.findTicker(tickerSearch)
console.log("result",result)
setLoading(false)

  }

  return (
    <div className="flex-grow bg-neutral-50 flex flex-col  ">
      
      <form onSubmit={submitFindTicker} className="flex flex-col m-auto rounded-md p-4">

    <p className="mx-auto text-lg font-semibold pb-4">Add new ticker</p>
    <div className="flex space-x-2">

    <Input value={tickerSearch} onChange={(e)=>{setTickerSearch(e.target.value)}}/>
    <Button>Submit</Button>
    </div>
    {loading ? <div className="bg-red-300 size-4">loading xd</div>:null}
      </form>
    </div>
  );
};

