import { Toaster } from "react-hot-toast";
import { BrowserRouter, createBrowserRouter, Location, Navigate, Route, RouterProvider, Routes, useLocation } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AuthorizedRoute } from "./features/AuthorizedRoute";
import { PortfolioPage } from "./pages/PortfolioPage";
import { MainLayout } from "./layout/MainLayout";
import { ToolsPage } from "./pages/ToolsPage";
import { BuyModal } from "./features/BuyModal";


function getRouter(location:Location<any>){
  const background = location.state && location.state.background;

 return  createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/portfolio", //todo porftolio id in params
    element: (
      // <AuthorizedRoute>
      <MainLayout>

        <PortfolioPage />
      </MainLayout>
      // </AuthorizedRoute>
    ),
    children:[{
      
      path: "buy", 
      element: (
  
          <BuyModal />

      ),
    },
    ]
  },

  {
    path: "/tools",
    element: (
      // <AuthorizedRoute>
      <MainLayout>

        <ToolsPage />
      </MainLayout>
      // </AuthorizedRoute>
    ),
  },

  // 404
  {
    path: "/",
    element: <Navigate to='/login'/>,
  },
  
]);
}

function App() {


  const location = useLocation();
  const background = location.state && location.state.background;


  return (
    <>
      <Toaster />
      {/* <RouterProvider router={getRouter(location)} /> */}


      <Routes location={background || location}>

      <Route path="/login" element={<LoginPage />}/>
      <Route path="/register" element={<RegisterPage />}/>

        <Route path="/portfolio" element={
        
        <MainLayout>

        <PortfolioPage />
        </MainLayout>
        
        }>
          <Route path="/portfolio/buy" element={<BuyModal />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="/portfolio/buy" element={<BuyModal />} />
        </Routes>
      )}


    </>
  );
}

export default App;
