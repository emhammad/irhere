import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import IRhere from '../../../../assets/irhere_images/Group 203.png';
import hide from '../../../../assets/irhere_images/hide.png';
import show from '../../../../assets/irhere_images/collapse.png';
import "./sidebar.css";

function Aside() {
  const location = useLocation();
  const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth > 1200 ? 250 : 80);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setSidebarWidth(window.innerWidth > 1200 ? 250 : 80);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCollapsed(sidebarWidth === 80);
    }, 70); // Adjust the delay time as needed

    return () => clearTimeout(timeout);
  }, [sidebarWidth]);

  const isActive = (pathname) => {
    return location.pathname === pathname;
  };

  const menuItems = [
    { path: "/dashboard", icon: "ti ti-smart-home", title: "Dashboard" },
    { path: "/validation-list", icon: "ti ti-layout-kanban", title: "Validations List" },
    { path: "/transaction-list", icon: "ti ti-text-wrap-disabled", title: "Transactions List" },
    { path: "/user-list", icon: "ti ti-users", title: "Users List" },
    { path: "/voucher-list", icon: "ti ti-percentage", title: "Vouchers" },
    { path: "/app-setting", icon: "ti ti-settings", title: "App Settings" },
    { path: "/search-validation", icon: "ti ti-search", title: "Search Validation" },
    { path: "/map-view", icon: "ti ti-map", title: "Validations Map View" }
  ];

  return (
    <>
      <aside id="layout-menu" className={`hm-layout-menu menu-vertical menu bg-menu-theme ${collapsed ? 'collapsed' : ''} `} style={{ width: sidebarWidth + "px" }}>

        <div className="app-brand demo ">
          <Link to='/dashboard' className="app-brand-link justify-content-around my-3">
            <img src={IRhere} alt="" className="me-3" />
            <h4 className="m-0">IRhere</h4>
          </Link>
          {window.innerWidth > 1200 && (
            <button className="layout-menu-toggle menu-link text-large ms-auto border-0 bg-transparent" onClick={() => setSidebarWidth(sidebarWidth === 250 ? 80 : 250)}>
              {/* <i className="ti menu-toggle-icon d-none d-xl-block align-middle"></i>
              <i className="ti ti-x d-block d-xl-none align-middle"></i> */}
              {sidebarWidth === 80 ? <img src={show} alt="" style={{ width: "25px" }} /> : <img src={hide} alt="" style={{ width: '24px' }} />}

            </button>
          )}
        </div>

        <div className="menu-inner-shadow"></div>

        <ul className="menu-inner py-1">
          {menuItems.map((item, index) => (
            <MenuItem key={index} path={item.path} icon={item.icon} title={item.title} isActive={isActive} sidebarWidth={sidebarWidth} />
          ))}
        </ul>

      </aside>
    </>
  );
}

const MenuItem = ({ path, icon, title, isActive, sidebarWidth }) => (
  <li className={`menu-item ${isActive(path) ? "active" : ""}`}>
    <Link to={path} className={`menu-link hm-active-link`}>
      <i className={`menu-icon tf-icons ${icon} ${sidebarWidth === 80 ? "hm-list-color" : ""}`}></i>
      <div className={`${sidebarWidth === 80 ? 'link-title hm-list-color' : ''}`} >{title}</div>
    </Link>
  </li>
);

export default Aside;
