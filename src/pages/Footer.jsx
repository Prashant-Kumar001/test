import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 font-ubuntu  text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-center md:text-left mb-3 md:mb-0">
          &copy; {new Date().getFullYear()} <span className="font-semibold">ShopEase</span>. All rights reserved.
        </p>

        <nav className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
          <Link to="/privacy" className="hover:text-gray-400 transition-colors duration-200">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-gray-400 transition-colors duration-200">Terms of Service</Link>
          <Link to="/contact" className="hover:text-gray-400 transition-colors duration-200">Contact Us</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
