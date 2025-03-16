// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/norsenter.png'; 

const Header = () => {
  const { isAdmin, logout } = useAuth();

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-custom">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Nor Senter Logo" width="50" height="50" className="d-inline-block align-top mr-2 "/>
            Nor Senter
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Hjem</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">Om Oss</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Kontakt</Link>
              </li>
              {!isAdmin ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Logg inn</Link>
                </li>
              ) : (
                <li className="nav-item">
                  <button className="btn btn-secondary nav-link" onClick={logout}>Logg ut</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;