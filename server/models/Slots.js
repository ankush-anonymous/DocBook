const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  day: {
    type: String,
    required: [true, "Please provide day"],
    maxlength: 13,
  },
  date: {
    type: Date,
    required: [true, "Please provide date"],
  },
  startTime: {
    type: String,
    required: [true, "Please provide start time"],
  },
  endTime: {
    type: String,
    required: [true, "Please provide end time"],
  },
  capacity: {
    type: Number,
    required: [true, "Please provide capacity of slot"],
  },
});

module.exports = mongoose.model("Slots", SlotSchema);
