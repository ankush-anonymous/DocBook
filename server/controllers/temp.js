const Appointment = require("../models/booking");
const Slot = require("../models/Slots");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllSlots = async (req, res) => {
  const queryObject = {};
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
  queryObject.date = todayDate;

  const slots = await Slot.find(queryObject);
  res.status(StatusCodes.OK).json({ slots, count: slots.length });
};

const createAppointment = async (req, res) => {
  try {
    const { userPhone, slotId } = req.body;

    // Create appointment
    const appointment = await Appointment.create({ userPhone, slotId });

    res.status(StatusCodes.CREATED).json({ appointment });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Server error" });
  }
};

const getAllAppointments = async (req, res) => {
  const appointment = await Appointment.find({});
  res.status(StatusCodes.OK).json({ appointment, count: appointment.length });
};

const getAppointment = async (req, res) => {
  const {
    params: { id: appId },
  } = req;
  const appointment = await Appointment.findOne({ _id: appId });
  if (!appointment) {
    throw new NotFoundError(`No appointment with id ${slotId}`);
  }
  res.status(StatusCodes.OK).json({ appointment });
};

const deleteAppointment = async (req, res) => {
  const {
    params: { id: appId },
  } = req;
  const appointment = await Appointment.findByIdAndDelete(appId);
  if (!appointment) {
    throw new NotFoundError(`No appointment with id ${appId}`);
  }

  res.status(StatusCodes.OK).send("Appointment deleted successfully");
};

module.exports = {
  getAllSlots,
  getAllAppointments,
  createAppointment,
  getAppointment,
  deleteAppointment,
};
