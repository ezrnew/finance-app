import { getCookie } from '@/utils/getCookie'
import React from 'react'
import { Navigate } from 'react-router-dom'

export const AuthorizedRoute = ({children}:{children:React.ReactNode}) => {
    if(!getCookie('authorized'))   return <Navigate to="/login"/>

  return children
}
