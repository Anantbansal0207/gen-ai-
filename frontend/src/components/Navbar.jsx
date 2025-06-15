import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LumayaLogo.png"; // use your logo image

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

   const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <nav style={{position: 'sticky', top:0, zIndex:'1000'}} className="navbar">
      <div className="navbar-logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
        <img style={{transform: 'scale(1)'}} src={logo} alt="Logo" />
        <span style={{color:'#ffc107', fontSize:'20px'}} className="brand-name">Lumaya</span>
      </div>

      <div className="navbar-links">
        <button  style={{
    backgroundColor: "#f8b404",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    marginRight: "10px",
    cursor: "pointer",
    borderRadius:"100px"
  }} onClick={() => navigate("/signup")}>Sign Up</button>
        <button  style={{
    backgroundColor: "#f8b404",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    marginRight: "10px",
    cursor: "pointer",
    borderRadius:"100px"
  }} onClick={() => navigate("/signin")}>Sign In</button>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
        <button onClick={() => { setMenuOpen(false); navigate("/signup"); }}>Sign Up</button>
        <button onClick={() => { setMenuOpen(false); navigate("/signin"); }}>Sign In</button>
      </div>
    </nav>
  );
};

export default Navbar;
