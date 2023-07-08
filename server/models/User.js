const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    maxlength: 50,
    minlength: 3,
  },
  age: {
    type: Number,
    required: [true, "Please provide correct age"],
    maxlength: 3,
  },
  gender: {
    type: String,
    required: [true, "Please provide correct gender"],
    enum: ["male", "female", "others"],
    default: "female",
  },
  phoneNumber: {
    type: Number,
    required: [true, "Please provide correct phone number"],
    minlength: 10,
    maxlength: 13,
    unique: true,
  },
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, phone: this.phoneNumber },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePhoneNo = async function (canditatePhone) {
  if (canditatePhone === this.phoneNumber) {
    return true;
  } else {
    return false;
  }
};

module.exports = mongoose.model("User", UserSchema);
