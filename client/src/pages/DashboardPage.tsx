import React from 'react'
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {

    const navigate = useNavigate();

  return (




    <button onClick={()=>{navigate('/drugi')}}>zalogowany</button>
  )
}
