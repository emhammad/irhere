import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarNavbar = () => {

  const location = useLocation();

  const isActive = (pathname) => {
    return location.pathname === pathname
  }


  return (
    <>
      {/* Navbar */}
      <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-transparent shadow-none m-0" id="layout-navbar">
        <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">

          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className="nav-item navbar-dropdown dropdown-user dropdown">

              <Link className="nav-link dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                <div className="avatar avatar-online">
                  <span className="avatar-initial rounded-circle bg-primary">A</span>
                </div>
              </Link>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar avatar-online">
                          <span className="avatar-initial rounded-circle bg-primary">A</span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <span className="fw-medium d-block">Samuel Franks</span>
                        <small className="text-muted">Admin</small>
                      </div>
                    </div>
                  </Link>
                </li>
                <li>
                  <div className="dropdown-divider"></div>
                </li>
                <li>
                  <Link className={`dropdown-item ${isActive('/account') ? 'active' : ''}`} to="/account">
                    <i className="ti ti-user-check me-2 ti-sm"></i>
                    <span className="align-middle">My Profile</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/">
                    <i className="ti ti-logout me-2 ti-sm"></i>
                    <span className="align-middle">Log Out</span>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default SidebarNavbar;
