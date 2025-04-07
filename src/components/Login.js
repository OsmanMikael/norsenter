import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth"; // legg til øverst

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

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Skriv inn e-postadressen din først.");
      return;
    }

    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("En e-post for tilbakestilling av passord er sendt.");
    } catch (error) {
      console.error(
        "Feil ved sending av tilbakestillings-e-post:",
        error.message
      );
      alert("Kunne ikke sende e-post. Sjekk at e-posten er riktig.");
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
          <button
            type="button"
            className="btn btn-link mt-2"
            onClick={handleForgotPassword}
          >
            Glemt passord?
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
