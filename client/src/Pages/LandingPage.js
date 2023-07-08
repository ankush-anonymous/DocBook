import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-center items-center h-screen">
      <div className="w-full lg:w-2/5 mb-6 lg:mb-0 lg:h-screen bg-orange-300">
        <lottie-player
          src="https://assets2.lottiefiles.com/packages/lf20_W6U9Osg3Pb.json"
          background="transparent"
          speed="1"
          loop
          autoplay
        ></lottie-player>
      </div>
      <div className="w-full lg:w-3/5 bg-white flex flex-col justify-center items-center p-8">
        <h1>
          <b className="text-orange-500 text-7xl md:text-7xl">DOCTOR'S</b>{" "}
          <b className="text-8xl text-amber-500">CLINIC</b>
        </h1>
        <p className="text-lg text-center mb-6">
          Providing quality healthcare services for all your needs.
        </p>
        <div className="w-full flex justify-center">
          <Link
            to="/login"
            className="bg-amber-600 text-white font-bold py-2 px-4 rounded"
          >
            Register / Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
