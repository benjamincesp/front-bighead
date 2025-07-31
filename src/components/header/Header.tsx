import React from "react";
import Styles from "./styles.module.css";

const Header = () => {
  return (
    <header className={Styles.headerContainer}>
      <div className={Styles.headerContent}>
        <div className={Styles.logoContainer}>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 13.5L8.5 16l3.5-2.5L15.5 16 12 13.5z"/>
            </svg>
          </div>
          <div className={Styles.logoText}>
            <h1>BigHead Food Service</h1>
            <p>Eventos Gastronómicos 2025</p>
          </div>
        </div>
        
        <nav className={Styles.navigation}>
          <ul className={Styles.navLinks}>
            <li><a href="/" className={Styles.navLink}>Inicio</a></li>
            <li><a href="/servicios" className={Styles.navLink}>Servicios</a></li>
            <li><a href="/eventos" className={Styles.navLink}>Eventos</a></li>
            <li><a href="/contacto" className={Styles.navLink}>Contacto</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;