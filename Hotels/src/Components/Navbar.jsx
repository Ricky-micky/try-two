import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-vilet-950 text-white py-4 px-6 shadow-md  ">
      <div className="flex justify-between items-center">
   

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link to="/home" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/book" className="hover:text-gray-300">
            Book
          </Link>
          <Link to="/profile" className="hover:text-gray-300">
            Profile
          </Link>
          <Link to="/hotel" className="hover:text-gray-300">
            Hotel
          </Link>
          <Link to="/" className="hover:text-gray-300">
            Register
          </Link>
          <Link to="/login" className="hover:text-gray-300">
            Login
          </Link>
          <Link to="/logout" className="hover:text-gray-300">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
