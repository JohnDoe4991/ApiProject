import React, { useState, useRef, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useHistory } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const ulRef = useRef();
  const [showMenu, setShowMenu] = useState(false);

  const handleModalClose = () => {
    setCredential("");
    setPassword("");
    setErrors({});
    closeModal();
  };

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


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(handleModalClose)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const isLoginDisabled = () => credential.length < 4 || password.length < 6;

  return (
    <>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label className="label-login">
            <div className="label-title"></div>
            <input
              type="text"
              value={credential}
              placeholder="Username or Email"
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          {errors.credential && <p className="errors">{errors.credential}</p>}
        </div>
        <div>
          <div className="label-title"></div>
          <label className="label-login">
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p className="errors">{errors.password}</p>}
        </div>
        <button type="submit" disabled={isLoginDisabled()}>Log In</button>
        <button className="buttons-login" onClick={(e) => {
          const credential = "Demo-lition"
          const password = "password"
          closeMenu()
          closeModal()
          return dispatch(sessionActions.login({ credential, password }))
        }}>Login as Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
