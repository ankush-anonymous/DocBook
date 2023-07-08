const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userPhone: {
    type: Number,
    required: true,
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
