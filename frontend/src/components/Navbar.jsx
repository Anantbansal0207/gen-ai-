import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ user, onLogout, navLinks }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isCurrentPath = (path) => location.pathname === path;

  return (
    <nav style={{position: 'sticky', top: 0, zIndex: 1000}} className="bg-background shadow-lg transition-colors duration-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-primary hover:text-primary-hover transition-colors duration-200"
            >
              AI Therapist
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isCurrentPath(link.path)
                    ? 'bg-primary text-cream'
                    : 'text-primary hover:bg-cream transition-colors duration-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-full text-sm font-medium bg-accent text-cream hover:bg-accent/90 transition-colors duration-200"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-full text-sm font-medium bg-accent text-cream hover:bg-accent/90 transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
            
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 p-2 rounded-md text-primary hover:bg-cream focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-cream/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isCurrentPath(link.path)
                    ? 'bg-primary text-cream'
                    : 'text-primary hover:bg-cream transition-colors duration-200'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-accent text-cream hover:bg-accent/90 transition-colors duration-200"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md text-base font-medium bg-accent text-cream hover:bg-accent/90 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;