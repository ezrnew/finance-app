import { useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';


const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage/>,
  },
  {
    path: "/register",
    element: <RegisterPage/>,
  },
]);

function App() {

  return (
    <>
      <RouterProvider router={router} />


    </>
  )
}

export default App
