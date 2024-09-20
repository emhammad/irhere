import React, { useEffect } from "react";
import "../../../assets/vendor/css/pages/cards-advance.css";

import Appcard from "./sub_components/AppCard";
import Dealchart from "./sub_components/DealCard";
import Reportscharts from "./sub_components/ReportsCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    const checkUserCredentials = () => {
      if (!user) {
        navigate("/portal/login");
        return;
      }
    };
    checkUserCredentials();
  }, [user, navigate]);
  return (
    <>
      <div className="container-xxl flex-grow-1">
        <div className="row">
          <div className="col-xl-12 mb-4 col-lg-12 col-12">
            <Appcard />
          </div>
          <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
            <Dealchart />
          </div>
          <div className="col-lg-8 col-md-12 mb-4 col-sm-12" style={{ height: "min-content" }}>
            <Reportscharts />
          </div>
        </div>
      </div>
    </>
  );
}
export default Dashboard;
