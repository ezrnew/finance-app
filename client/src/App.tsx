import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { DeleteAccountModal } from "./features/modals/AccountDeleteModal";
import { AddPaymentModal } from "./features/modals/AddPaymentModal";
import { BuyAssetModal } from "./features/modals/BuyAssetModal";
import { NewPortfolioModal } from "./features/modals/NewPortfolioModal";
import { PortfolioOperationsHistoryModal } from "./features/modals/PortfolioOperationsHistoryModal";
import { SellAssetModal } from "./features/modals/SellAssetModal";
import { MainLayout } from "./layout/MainLayout";
import { LoginPage } from "./pages/LoginPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ToolsPage } from "./pages/ToolsPage";
import { store } from "./store/store";
import { ls } from "./utils/localStorage";
import { AuthorizedRoute } from "./features/AuthorizedRoute";

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <div className={ls.getDarkMode() === "1" ? "dark" : ""}>
      <Provider store={store}>
        <Toaster />
        <Routes location={background || location}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/tools"
            element={
              <AuthorizedRoute>
                <MainLayout>
                  <ToolsPage />
                </MainLayout>
              </AuthorizedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />

          <Route
            path="/portfolio"
            element={
              <AuthorizedRoute>
                <MainLayout>
                  <PortfolioPage />
                </MainLayout>
              </AuthorizedRoute>
            }
          ></Route>
        </Routes>
        {background && (
          <Routes>
            <Route path="/portfolio/buy" element={<BuyAssetModal />} />
            <Route path="/portfolio/sell" element={<SellAssetModal />} />
            <Route path="/portfolio/payment" element={<AddPaymentModal />} />
            <Route
              path="/portfolio/operations"
              element={<PortfolioOperationsHistoryModal />}
            />
            <Route
              path="/portfolio/deleteAccount"
              element={<DeleteAccountModal />}
            />
            <Route path="/portfolio/new" element={<NewPortfolioModal />} />
          </Routes>
        )}
      </Provider>
    </div>
  );
}

export default App;
