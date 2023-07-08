import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUser } from "react-icons/fi";

const Navbar = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from localhost
    axios.get("http://localhost:5000/api/v1/user").then((response) => {
      setUserData(response.data);
    });
  }, []);

  const handleLogout = () => {
    // Clear user data from local storage and redirect to login page
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  const name = localStorage.getItem("name");
  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-300 text-white py-4 px-8">
      <span className="font-bold text-xl">Doctor's Clinic</span>

      {userData && (
        <div className="flex items-center">
          <FiUser className="text-2xl text-gray-800 mr-2" />
          <span className="mr-4">{name}</span>
          <button
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
