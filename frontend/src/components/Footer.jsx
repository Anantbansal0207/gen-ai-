import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* CONTACT */}
          <div className="flex flex-col space-y-4 min-h-[250px]">
            <h3 className="text-lg font-semibold text-primary">CONTACT</h3>
            <div className="text-gray-600 space-y-2">
              <p>xryptt@gmail.com</p>
              <a href="#" className="block hover:text-primary">X (Twitter)</a>
              <a href="#" className="block hover:text-primary">LinkedIn</a>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="flex flex-col space-y-4 min-h-[250px]">
            <h3 className="text-lg font-semibold text-primary">PRODUCTS</h3>
            <ul className="text-gray-600 space-y-2">
              <li><a href="#" className="hover:text-primary">AI Therapist</a></li>
              <li><a href="#" className="hover:text-primary">Dream Interpreter</a></li>
            </ul>
          </div>

          {/* USE CASES */}
          <div className="flex flex-col space-y-4 min-h-[250px]">
            <h3 className="text-lg font-semibold text-primary">USE CASES</h3>
            <ul className="text-gray-600 space-y-2">
              <li><a href="#" className="hover:text-primary">Therapeutic Conversation Support</a></li>
              <li><a href="#" className="hover:text-primary">Track Emotional Patterns</a></li>
              <li><a href="#" className="hover:text-primary">Daily Mental Health Check-ins</a></li>
              <li><a href="#" className="hover:text-primary">Understand Your Dreams</a></li>
              <li><a href="#" className="hover:text-primary">Improve Sleep & Mental Clarity</a></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div className="flex flex-col space-y-4 min-h-[250px] justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary">COMPANY</h3>
              <ul className="text-gray-600 space-y-2">
                <li><Link to="/refund-policy" className="hover:text-primary">Refund Policy</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
            <p className="text-gray-600">© 2024 Wallet Monitor Ltd.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
