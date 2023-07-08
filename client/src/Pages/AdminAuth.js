import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(true);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data for API call
    const data = {
      email,
      password,
    };

    // Determine the API endpoint based on the mode (register or login)
    const endpoint = isRegisterMode
      ? "http://localhost:5000/api/v1/admin/register"
      : "http://localhost:5000/api/v1/admin/login";

    if (isRegisterMode) {
      data.name = name;
    }

    // Perform API call to register or login admin
    axios
      .post(endpoint, data)
      .then((response) => {
        // Handle response from the API
        console.log(response.data);

        if (isRegisterMode) {
          toast.success("Admin registered successfully");
        } else {
          toast.success("Admin logged in successfully");

          // Store the token in local storage
          localStorage.setItem("authorised", "true");
          localStorage.setItem("token", response.data.token);
        }

        setName("");
        setEmail("");
        setPassword("");

        // Navigate to the admin page
        navigate("/admin");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Invalid Credentials");
      });
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="w-full sm:w-96 bg-white rounded shadow p-6">
        {isRegisterMode ? (
          <h2 className="text-2xl mb-4">Admin Registration</h2>
        ) : (
          <h2 className="text-2xl mb-4">Login Admin</h2>
        )}
        <form onSubmit={handleSubmit}>
          {isRegisterMode && (
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-sm">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {isRegisterMode ? "Register" : "Login"}
          </button>
        </form>
        {isRegisterMode ? (
          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <button className="text-blue-500 underline" onClick={toggleMode}>
              Login
            </button>
          </p>
        ) : (
          <p className="mt-4 text-sm text-center">
            Don't have an account?{" "}
            <button className="text-blue-500 underline" onClick={toggleMode}>
              Register Admin
            </button>
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminAuth;
