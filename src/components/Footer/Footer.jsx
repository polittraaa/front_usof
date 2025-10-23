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
          <p className="mr4">contact us: <a style={{textDecoration: "none", color: " rgb(154, 195, 163)"}}href="#">ptovstonoh@gmail.com</a></p>
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
