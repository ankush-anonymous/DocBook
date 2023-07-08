const express = require("express");
const router = express.Router();

const {
  getAllSlots,
  getAllAppointments,
  createAppointment,
  deleteAppointment,
  getAppointment,
} = require("../controllers/appointment");

// Retrieve all slots
router.get("/slots", getAllSlots);

// Retrieve all appointments
router.get("/", getAllAppointments);

// Create a new appointment
router.post("/", createAppointment);

// Delete an appointment by ID
router.delete("/:id", deleteAppointment);

// Get an appointment by ID
router.get("/:id", getAppointment);

module.exports = router;
