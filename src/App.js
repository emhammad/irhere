import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/pages/auth/login";
import Dashboard from "./components/pages/dashboard/dashboard";
import { Toaster } from "react-hot-toast";
import Navbar from './components/pages/Layouts/navbar';
import Aside from "./components/pages/Layouts/sidebar/aside";
import ValidationList from "./components/pages/validation-list/validation-list";
import TransactionList from "./components/pages/transaction-list/transaction-list";
import NotFound from "./components/pages/notFound/notFound";
import UserList from "./components/pages/user-list/userList";
import VoucherList from "./components/pages/voucher-list/voucher";
import MapView from "./components/pages/mapView/mapView";
import Account from "./components/pages/accounts/accounts";
import AppSetting from "./components/pages/app-settings/appSetting";
import SearchValidation from "./components/pages/search-validations/searchValidation";
import Registration from "./components/pages/Registration/registration";

const App = () => {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </>
  );
};

const AppContent = () => {

  const location = useLocation();



  return (
    <>
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          {location.pathname === "/" || location.pathname === "*" || location.pathname === "/registration" ? "" : <Aside />}
          <div className="layout-page">
            {location.pathname === "/" || location.pathname === "*" || location.pathname === "/registration" ? "" : <Navbar />}
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/validation-list" element={<ValidationList />} />
                <Route path="/transaction-list" element={<TransactionList />} />
                <Route path="/user-list" element={<UserList />} />
                <Route path="/voucher-list" element={<VoucherList />} />
                <Route path="/map-view" element={<MapView />} />
                <Route path="/account" element={<Account />} />
                <Route path="/app-setting" element={<AppSetting />} />
                <Route path="/search-validation" element={<SearchValidation />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <div className="content-backdrop fade"></div>
          </div>
        </div>
        <div className="layout-overlay layout-menu-toggle"></div>
      </div>
    </>
  )
}

export default App;
