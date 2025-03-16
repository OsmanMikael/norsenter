// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import PrayerTimes from './components/PrayerTimes';
import Login from './components/Login';
import { FaWhatsapp } from "react-icons/fa"; // Importer WhatsApp-ikonet
import './styles/main.css'; // Sørg for å importere hoved CSS-filen

const App = () => {
  const whatsappNumber = "+4712345678"; // Erstatt med riktig telefonnummer

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
