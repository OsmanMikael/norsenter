import React from "react";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="custom-footer">
      <p>© {currentYear} Nor Senter</p>
      
      <div className="social-icons">
        <a href="https://instagram.com/norsenterinoslo/" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="icon text-danger fs-3 mx-2" />
        </a>
        <a href="https://facebook.com/norsenteroslo/" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="icon text-primary fs-3 mx-2" />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          <FaYoutube className="icon text-danger fs-3 mx-2" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
