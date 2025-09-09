import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";
import logo from "../assets/LumayaLogo.png";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    console.log(`Attempting to navigate to: ${path}`);
    try {
      navigate(path);
      window.scrollTo(0, 0); // Add this line
      console.log(`Navigation to ${path} called successfully`);
    } catch (error) {
      console.error(`Navigation error:`, error);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img style={{ width: '45px' }} src={logo} alt="Lumaya Logo" className="footer-logo" />
          <h2>Lumaya</h2>
          <p>Your mind, made lighter.</p>
        </div>

        <div className="footer-contact">
          <h4>Stay Connected</h4>
          <p>Email: support@lumaya.com</p>

          {/* <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div> */}

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', position: 'relative', zIndex: 10 }}>
            <span
              onClick={() => handleNavigation('/about')}
              style={{ cursor: 'pointer', textDecoration: 'none', color: '#ccc', position: 'relative', zIndex: 10 }}
            >
              About Us
            </span>
            <span
              onClick={() => handleNavigation('/privacy')}
              style={{ cursor: 'pointer', textDecoration: 'none', color: '#ccc', position: 'relative', zIndex: 10 }}
            >
              Privacy Policy
            </span>
            <span
              onClick={() => handleNavigation('/chat-guide')}
              style={{ cursor: 'pointer', textDecoration: 'none', color: '#ccc', position: 'relative', zIndex: 10 }}
            >
              Chat Guide
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <h1 className="footer-title">LUMAYA</h1>
        {/* <p>© {new Date().getFullYear()} Lumaya. All rights reserved.</p> */}
      </div>
    </footer>
  );
};

export default Footer;