import { Toaster } from "react-hot-toast";
import { BrowserRouter, createBrowserRouter, Location, Navigate, Route, RouterProvider, Routes, useLocation } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AuthorizedRoute } from "./features/AuthorizedRoute";
import { PortfolioPage } from "./pages/PortfolioPage";
import { MainLayout } from "./layout/MainLayout";
import { ToolsPage } from "./pages/ToolsPage";
import { BuyAssetModal } from "./features/modals/BuyAssetModal";
import { SellAssetModal } from "./features/modals/SellAssetModal";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AddPaymentModal } from "./features/modals/AddPaymentModal";


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
  
          <BuyAssetModal />

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
    <Provider store={store}>

      <Toaster />
      {/* <RouterProvider router={getRouter(location)} /> */}


      <Routes location={background || location}>

      <Route path="/login" element={<LoginPage />}/>
      <Route path="/register" element={<RegisterPage />}/>
      <Route path="/tools" element={<MainLayout><ToolsPage/></MainLayout>}/>

        <Route path="/portfolio" element={
         
        <MainLayout>

        <PortfolioPage />
        </MainLayout>
        
        }>
             {/* <Route path="/portfolio/buy" element={<BuyAssetModal />} /> */}
          {/* <Route path="/portfolio/buy" element={<BuyAssetModal />} /> */}
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="/portfolio/buy" element={<BuyAssetModal />} />
          <Route path="/portfolio/sell" element={<SellAssetModal />} />
          <Route path="/portfolio/payment" element={<AddPaymentModal />} />
        </Routes>
      )}

</Provider>

    </>
  );
}

export default App;
