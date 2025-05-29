// Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Visualizer', path: '/visualizer' },
    { name: 'Drugs', path: '/drugs' },
    {name: 'Bookmarks', path: '/bookmark'},
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
    ...(isLoggedIn 
      ? []  // If logged in, don't show login/signup
      : [
          { name: 'Sign Up', path: '/signup' },
          { name: 'Login', path: '/login' }
        ]
    ),
  ];

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-blue-700">DrugViz</Link>

          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <motion.div
                key={link.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.path ? 'text-blue-700' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            {isLoggedIn && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Logout
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
