import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "../../../store/Slices/UserSlice";
import toast from "react-hot-toast";
import axios from "axios";

const SidebarNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user || []);
  const location = useLocation();
  const [userName, setUserName] = useState();
  const url = process.env.REACT_APP_SERVER_DOMAIN;

  const isActive = (pathname) => location.pathname === pathname;

  // Handle redirection based on user authentication status
  useEffect(() => {
    const token = user?.access_token;

    // if (token && location.pathname === "/portal/login") {
    //   navigate("/portal/dashboard");
    //   return; // Return early to avoid further execution
    // }

    // Fetch user data if not redirected
    const fetchUserData = async () => {
      if (!token) {
        navigate('/portal/login');
        return;
      }

      try {
        const response = await axios.get(`${url}/api/fetch_admin/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setUserName(response.data.name);

      } catch (error) {
        console.log(error.response.statusText);
        if (error.response?.statusText === 'UNAUTHORIZED') {
          dispatch(signOut());
        }
      }
    };

    fetchUserData();
  }, [user, url, navigate, location.pathname, dispatch]);

  const handleSignOutUser = () => {
    navigate("/portal/login");
    toast.success('Logout successfully.');
    dispatch(signOut());
  };

  return (
    <>
      {/* Navbar */}
      <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-transparent shadow-none m-0" id="layout-navbar">
        <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className="nav-item navbar-dropdown dropdown-user dropdown">
              <Link className="nav-link dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                <div className="avatar avatar-online">
                  <span className="avatar-initial rounded-circle bg-primary">{userName?.charAt(0)}</span>
                </div>
              </Link>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <div className="dropdown-item">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar avatar-online">
                          <span className="avatar-initial rounded-circle bg-primary">{userName?.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <span className="fw-medium d-block">{userName}</span>
                        <small className="text-muted">Admin</small>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="dropdown-divider"></div>
                </li>
                <li>
                  <Link className={`dropdown-item ${isActive('/portal/account') ? 'active' : ''}`} to="/portal/account">
                    <i className="ti ti-user-check me-2 ti-sm"></i>
                    <span className="align-middle">My Profile</span>
                  </Link>
                </li>
                <li>
                  <Link className={`dropdown-item`} onClick={handleSignOutUser}>
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
