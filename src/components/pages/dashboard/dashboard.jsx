import React from "react";
import "../../../assets/vendor/css/pages/cards-advance.css";

import Appcard from "./sub_components/app-card";
import Dealchart from "./sub_components/deal-card";
import Reportscharts from "./sub_components/reports-card";

function Dashboard() {

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
