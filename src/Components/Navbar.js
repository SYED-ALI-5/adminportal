import React from "react";
import { FaEdit, FaPlus, FaMinus, FaSignOutAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import logo_icon from "../Assets/logo.png";

export default function Navbar(props) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClickUser = () => {
    navigate("/usermanagement", { state: { type: "customer" } });
  };

  const handleClickOwner = () => {
    navigate("/usermanagement", { state: { type: "groundOwner" } });
  };

  const allowedRoutes = [
    "/",
    "/overview",
    "/notifications",
    "/addground",
    "/removeground",
    "/editground",
    "/editspecificground",
    "/ground",
    "/usermanagement",
    "/bookinghistory",
    "/viewprofile",
    "/help",
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary d-flex flex-row justify-content-between align-items-center">
        <div className="logo">
          <img src={logo_icon} alt="Logo" />
          <h1>{props.title}</h1>
        </div>

        {allowedRoutes.includes(location.pathname) && (
          <div class="admin-pages">
            <ul class="navbar-nav me-auto mb-lg-0">
              <li class="nav-item mx-3">
                <a class="nav-link active" aria-current="page" href="/overview">
                  Overview
                </a>
              </li>
              <li class="nav-item dropdown mx-3">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Ground Management
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <a
                      class="dropdown-item d-flex flex-row justify-content-between align-items-center px-2"
                      href="/addground"
                    >
                      Add Ground
                      <FaPlus />
                    </a>
                  </li>
                  <li>
                    <hr class="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      class="dropdown-item d-flex flex-row justify-content-between align-items-center px-2"
                      href="/editground"
                    >
                      Edit Ground
                      <FaEdit />
                    </a>
                  </li>
                  <li>
                    <hr class="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      class="dropdown-item d-flex flex-row justify-content-between align-items-center px-2"
                      href="/removeground"
                    >
                      Remove Ground
                      <FaMinus />
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item dropdown mx-3">
                <a
                  class="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  href="#"
                >
                  Users Management
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <a
                      class="dropdown-item d-flex flex-row justify-content-between align-items-center px-2"
                      onClick={handleClickUser}
                    >
                      Customer Users
                    </a>
                  </li>
                  <li>
                    <hr class="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      class="dropdown-item d-flex flex-row justify-content-between align-items-center px-2"
                      onClick={handleClickOwner}
                    >
                      Ground Owners
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item mx-3">
                <a
                  class="nav-link active"
                  aria-current="page"
                  href="/notifications"
                >
                  Help Requests
                </a>
              </li>
            </ul>
          </div>
        )}

        <div className="logIn pe-4">
          <Link to="https://www.google.com.pk" className="btn-log">
            SignOut <FaSignOutAlt />
          </Link>
        </div>
      </nav>
    </>
  );
}
