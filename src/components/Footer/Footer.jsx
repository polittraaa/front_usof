import { useEffect, useState } from 'react';
import './Footer.css';

function Footer({ onRouteChange }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="contact">
          <p>contact us</p>
          <p>ptovstonoh@gmail.com</p>
        </div>

        <div className="footer-icons">
          <button type="button" title="GitHub" className="icon-btn">
           <i className="fa-brands fa-github"></i>
          </button>
          
          <button type="button" title="LinkedIn" className="icon-btn">
            <i className="fa-brands fa-square-linkedin"></i>
          </button>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
