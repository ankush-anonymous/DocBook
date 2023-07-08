import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const LoginForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const navigate = useNavigate();

  const handleRegisterClick = async (e) => {
    e.preventDefault();

    if (!name || !age || !phoneNumber) {
      toast.error("All fields are required");
      return;
    }

    if (isNaN(parseInt(age))) {
      toast.error("Age must be a valid number");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        {
          name,
          age,
          gender,
          phoneNumber,
        }
      );

      if (response.status === 201) {
        toast.success("User registered successfully");
        setName("");
        setAge("");
        setGender("male");
        setPhoneNumber("");
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("An error occurred while registering the user");
    }
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();

    if (!phoneNumber || phoneNumber.length !== 10) {
      toast.error("Please provide a correct phone number.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        {
          phoneNumber,
        }
      );

      if (response.status === 200) {
        toast.success("User logged in successfully");
        localStorage.setItem("user authorised", "true");
        const { token, user, phoneNumber } = response.data;
        const { name } = user;
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        localStorage.setItem("phone", phoneNumber);

        setPhoneNumber("");
        navigate("/appointment"); // Update the route to "/appointment"
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("An error occurred while logging in");
    }
  };

  const handleLoginAdminClick = () => {
    navigate("/authadmin");
  };

  const renderLoginForm = () => (
    <div>
      <h2 className="text-3xl font-bold text-center mb-4">User Login</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="phoneNumber" className="text-lg">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="text-center">
          <button
            className="bg-orange-600 text-white font-bold px-6 py-2 rounded"
            onClick={handleLoginClick}
          >
            Get OTP
          </button>
        </div>
      </form>
      <p className="text-center mt-4">
        Not registered yet?{" "}
        <span
          className="text-blue-500 cursor-pointer font-bold"
          onClick={() => setIsRegistering(true)}
        >
          Register
        </span>
      </p>
      <p className="text-center mt-2">
        <span
          className="text-blue-500 cursor-pointer font-bold"
          onClick={handleLoginClick}
        >
          Login as Admin
        </span>
      </p>
    </div>
  );

  const renderRegistrationForm = () => (
    <div>
      <h2 className="text-3xl font-bold text-center mb-4">Register User</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="text-lg">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="age" className="text-lg">
            Age
          </label>
          <input
            type="number"
            id="age"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="gender" className="text-lg">
            Gender
          </label>
          <select
            id="gender"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div>
          <label htmlFor="phoneNumber" className="text-lg">
            Phone Number
          </label>
          <div className="flex">
            <input
              type="text"
              id="phoneNumber"
              className="w-full border border-gray-300 px-4 py-2 rounded"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button className="ml-4 bg-orange-500 text-white font-bold px-4 py-2 rounded">
              Verify
            </button>
          </div>
        </div>
        <div className="text-center">
          <button
            className="bg-orange-600 text-white font-bold px-6 py-2 rounded"
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </div>
      </form>
      <p className="text-center mt-4">
        Already registered?{" "}
        <span
          className="text-blue-500 cursor-pointer font-bold"
          onClick={() => setIsRegistering(false)}
        >
          Login as Admin
        </span>
      </p>
    </div>
  );

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-orange-500 to-orange-300">
      <div className="bg-white p-8 rounded shadow-lg">
        {isRegistering ? renderRegistrationForm() : renderLoginForm()}
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;
