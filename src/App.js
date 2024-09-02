import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/pages/home/Home";
import Login from "./components/pages/auth/Login";
import Dashboard from "./components/pages/dashboard/Dashboard";
import { Toaster } from "react-hot-toast";
import Navbar from './components/pages/Layouts/Navbar';
import Aside from "./components/pages/Layouts/sidebar/Aside";
import ValidationList from "./components/pages/validation-list/ValidationList";
import TransactionList from "./components/pages/transaction-list/TransactionList";
import NotFound from "./components/pages/not-found/NotFound";
import UserList from "./components/pages/user-list/UserList";
import VoucherList from "./components/pages/voucher-list/Voucher";
import MapView from "./components/pages/map-view/MapView";
import Account from "./components/pages/accounts/Accounts";
import AppSetting from "./components/pages/app-settings/AppSetting";
import SearchValidation from "./components/pages/search-validations/SearchValidation";
import Registration from "./components/pages/registration/Registration";

const knownPaths = ["/registration", "/portal", "/validation-list", "/transaction-list", "/user-list", "/voucher-list", "/map-view", "/account", "/app-setting"];

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

  // Check if the current path is a known path
  const isKnownPath = knownPaths.includes(location.pathname);

  return (
    <>
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          {isKnownPath && <Aside />}
          <div className="layout-page">
            {isKnownPath && <Navbar />}
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/portal" element={<Dashboard />} />
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
  );
};

export default App;
