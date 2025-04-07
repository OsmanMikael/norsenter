import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Hvis brukeren er admin (sjekk e-post eller rolle i Firestore)
      if (user.email === "norsenter18f@gmail.com") {
        setIsAdmin(true);
        navigate("/"); // Omdiriger til Hjem-siden
      } else {
        alert("Du har ikke admin-tilgang");
      }
    } catch (error) {
      console.error("Feil ved innlogging:", error.message);
      alert("Feil e-post eller passord.");
    }
  };

  return (
    <div className="container mt-4">
      <section className="login">
        <h2>Logg inn</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">E-post:</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" className="btn btn-primary">
            Logg inn
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
