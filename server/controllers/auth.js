const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    throw new BadRequestError("Please provide phone number");
  }
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  // const isPhoneNoCorrect = await user.comparePhoneNo(user.phoneNumber);
  // if (!isPhoneNoCorrect) {
  //   throw new UnauthenticatedError("Invalid Credentials");
  // }

  const token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, token, phoneNumber });
};

module.exports = {
  login,
  register,
};
