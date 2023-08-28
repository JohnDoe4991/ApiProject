
import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import ruerrero from '../../logo/Ruerrero.png'
import "./Navigation.css";


function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="navBar-container">

      <div className="navBar-inner-container">
        <div className="navBar-logo-create-link">
          <NavLink exact to="/" className="navbar-logo"> ViajarBnB
            <img src={ruerrero} alt="logo" className="logo" />
          </NavLink>
        </div>
        <div className="navBar-logo-create-link">
          {sessionUser && (
            <div className="navBar-create-link">
              <NavLink to="/spots/new" className="create-new-spot">
                Create a New Spot
              </NavLink>
            </div>
          )}
          {isLoaded && (
            <ul className="navBar-far-right">

              <li>
                <ProfileButton user={sessionUser} showMenu={showMenu} />
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navigation;
