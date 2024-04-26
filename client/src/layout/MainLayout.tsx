import { Sidebar } from '@/features/Sidebar'
import React from 'react'

export const MainLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='h-screen w-screen flex'>
        <Sidebar/>
    {children}
    </div>
  )
}
