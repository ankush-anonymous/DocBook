const Slots = require("../models/Slots");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllSlots = async (req, res) => {
  const { day, date } = req.query;
  const queryObject = {};

  if (day) {
    queryObject.day = { $regex: day, $options: "i" };
  }

  if (date) {
    queryObject.date = date;
  }

  const slots = await Slots.find(queryObject);
  res.status(StatusCodes.OK).json({ slots, count: slots.length });
};

const getSlots = async (req, res) => {
  const {
    params: { id: slotId },
  } = req;
  const slot = await Slots.findOne({
    _id: slotId,
  });
  if (!slot) {
    throw new NotFoundError(`No job with id ${slotId}`);
  }

  res.status(StatusCodes.OK).json({ slot });
};
const createSlots = async (req, res) => {
  const slot = await Slots.create(req.body);
  res.status(StatusCodes.OK).json({ slot });
};
const updateSlots = async (req, res) => {
  const {
    body: { day, date, startTime, endTime, capacity },
    params: { id: slotId },
  } = req;

  if (
    day === "" ||
    date === "" ||
    startTime === "" ||
    endTime === "" ||
    capacity === ""
  ) {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }

  const slot = await Slots.findByIdAndUpdate({ _id: slotId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!slot) {
    throw new NotFoundError(`No job with id ${slotId}`);
  }

  res.status(StatusCodes.OK).json({ slot });
};
const deleteSlots = async (req, res) => {
  const {
    params: { id: slotId },
  } = req;
  const slot = await Slots.findByIdAndDelete({
    _id: slotId,
  });
  if (!slot) {
    throw new NotFoundError(`No job with id ${slotId}`);
  }

  res.status(StatusCodes.OK).send("Slot deleted successfully");
};

module.exports = {
  getAllSlots,
  getSlots,
  createSlots,
  updateSlots,
  deleteSlots,
};
