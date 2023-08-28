// frontend/src/components/Navigation/ProfileButton.js
// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useHistory } from "react-router-dom";
import "./Navigation.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faBars } from '@fortawesome/free-solid-svg-icons';


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push("/")
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <div className="profile-dropdown-container">

        <button className="prof-btn" aria-label="Main navigation menu" onClick={openMenu}>
          <FontAwesomeIcon icon={faBars} className="menu-i" />
          <FontAwesomeIcon icon={faUserCircle} className="prof-icon" />
        </button>

        <ul className={ulClassName} ref={ulRef}>
          {user ? (
            <>
              <li>{user.username}</li>
              <li>{user.firstName} {user.lastName}</li>
              <li>{user.email}</li>
              <li><button className="Manage-spot-button" onClick={(e) => {closeMenu(); history.push('/user/spots') }}>Manage Spots</button></li>
              <li><button type="button" onClick={(e) => { history.push('/reviews/current') }}>Manage Reviews</button></li>
              <li><button onClick={logout} className="buttons">Log Out</button></li>
            </>
          ) : (
            <>
              <li>
                <OpenModalMenuItem
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </li>
              <li>
                <OpenModalMenuItem
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </li>
              <li>
                <button className="buttons" onClick={(e) => {
                  const credential = "Demo-lition"
                  const password = "password"
                  closeMenu()
                  return dispatch(sessionActions.login({ credential, password }))
                }}>Demo User</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default ProfileButton;
