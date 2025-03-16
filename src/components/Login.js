// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Enkel autentisering: Bare for demonstrasjon.
    if (username === 'admin' && password === 'admin') {
      setIsAdmin(true);
      navigate('/'); // Omdiriger til Hjem-siden etter vellykket innlogging
    } else {
      setIsAdmin(false);
      alert('Feil brukernavn eller passord');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Logg inn</h2>
      <section className='login'>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Brukernavn:</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Passord:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Logg inn</button>
      </form>
      </section>
    </div>
  );
};

export default Login;