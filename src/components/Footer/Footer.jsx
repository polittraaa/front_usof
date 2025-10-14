import { useEffect, useState } from 'react';
import './Footer.css';

function Footer({ onRouteChange }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-contact">
          <p>contact us</p>
          <p>ptdev@gmail.com</p>
        </div>

        <div className="footer-icons">
          {/* GitHub */}
          <button type="button" title="GitHub" className="icon-btn">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon"></svg>
          </button>

          {/* Telegram */}
          <button type="button" title="Telegram" className="icon-btn">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" ></svg>
          </button>

          {/* LinkedIn */}
          <button type="button" title="LinkedIn" className="icon-btn">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon"></svg>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
