import { faChalkboard, faDashboard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LucidePieChart } from 'lucide-react'
import React from 'react'

export const Sidebar = () => {
  return (
    <div className='w-16 h-full bg-neutral-100 border border-r py-2 space-y-4  '>
      
      {/* <LucidePieChart className='size-10'/> */}
<FontAwesomeIcon className='w-full size-7' icon={faChalkboard}/>
    </div>
  )
}
