import { useEffect, useState } from 'react';
import './Footer.css';

function Footer({ onRouteChange, route }) {

   if (route === 'login' || route === 'register' || route === 'verify-email' || route === 'password-reset' || route === 'post') {
  // if (route !== 'home') {
    return (
      <footer style={{visibility: 'none'}}>
      
    </footer>
    );
  }
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="contact">
          <p className="mr4">Contact us: <a style={{textDecoration: "none", color: " rgb(154, 195, 163)"}}href="#">ptovstonoh@gmail.com</a></p>
        </div>

        <div className="footer-icons ma3">
          <a title="GitHub" className="icon-btn" href="https://github.com/polittraaa/front_usof">
           <i className="fa-brands fa-github"></i>
          </a>
          
          <button type="button" title="LinkedIn" className="icon-btn">
            <i className="fa-brands fa-square-linkedin"></i>
          </button>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
