import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Header,
  Footer,
  Home,
  About,
  Contact,
  PrayerTimes,
  Login,
} from "./components/index.tsx";

import { FaWhatsapp } from "react-icons/fa"; // Importer WhatsApp-ikonet

// Hvis du ønsker å være mer eksplisitt om typen av whatsappNumber, kan du bruke en string:
const App: React.FC = () => {
  const whatsappNumber: string = "+4792506096"; // Erstatt med riktig telefonnummer

  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/prayer-times" element={<PrayerTimes />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      {/* WhatsApp-ikon som vises på alle sider */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
      >
        <FaWhatsapp size={50} color="green" />
      </a>

      <Footer />
    </Router>
  );
};

export default App;
