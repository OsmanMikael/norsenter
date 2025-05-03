import React, { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { updateAboutText, db } from "./firebase.tsx"; // Husk å importere db fra firebase.js
import { onAuthStateChanged, getAuth, User } from "firebase/auth";

// Typing for komponentens tilstand
interface AboutProps {}

const About: React.FC<AboutProps> = () => {
  const [aboutText, setAboutText] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Sjekk om brukeren er logget inn
  const [loading, setLoading] = useState<boolean>(true); // For å vise lastestatus mens vi henter teksten

  useEffect(() => {
    const auth = getAuth();

    // Lytt etter endringer i autentiseringstilstand
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setIsLoggedIn(true); // Brukeren er logget inn
      } else {
        setIsLoggedIn(false); // Brukeren er ikke logget inn
      }
    });

    return () => unsubscribe(); // Rydd opp når komponenten avmonteres
  }, []);

  useEffect(() => {
    // Hent About-tekst fra Firestore når komponenten er lastet
    const fetchAboutText = async () => {
      const docRef = doc(db, "content", "about"); // Referanse til dokumentet i Firestore
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAboutText(docSnap.data().text); // Sett teksten til state
      } else {
        console.log("Ingen dokument funnet!");
      }
      setLoading(false); // Ferdig med å hente data
    };

    fetchAboutText();
  }, []); // Denne effekten kjøres bare én gang når komponenten laster

  const handleSave = async () => {
    try {
      const result = await updateAboutText(aboutText);
      if (result.success) {
        alert("About-tekst lagret!");
      } else {
        alert("Feil ved lagring av About-tekst.");
      }
    } catch (error) {
      console.error(error);
      alert("Feil ved lagring av About-tekst.");
    }
  };

  if (loading) {
    return <p>Laster inn tekst...</p>; // Vist mens teksten lastes
  }

  return (
    <div className="about">
      <h2>Om Oss</h2>
      <p>{aboutText || "Informasjon om moskeen kommer her"}</p>

      {/* Vis redigeringsknappen kun hvis brukeren er logget inn */}
      {isLoggedIn && (
        <div>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            placeholder="Skriv om oss her..."
            style={{
              width: "100%",
              minHeight: "200px",
              padding: "10px",
              boxSizing: "border-box",
            }}
          />
          <div>
            <button onClick={handleSave}>Lagre</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
