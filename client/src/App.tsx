import { Toaster } from "react-hot-toast";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AuthorizedRoute } from "./features/AuthorizedRoute";
import { PortfolioPage } from "./pages/PortfolioPage";
import { MainLayout } from "./layout/MainLayout";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: (
      // <AuthorizedRoute>
      <MainLayout>

        <PortfolioPage />
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

function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
