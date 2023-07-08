import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookAppointment = () => {
  const [slots, setSlots] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const phoneNumber = localStorage.getItem("phone");

  useEffect(() => {
    fetchSlots();
    fetchAppointment();
  }, []);

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(
        "http://localhost:5000/api/v1/appointment/slots"
      );

      setSlots(response.data.slots);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAppointment = async (phoneNumber) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Find the user ID based on the phone number
      const userResponse = await axios.get(
        `http://localhost:5000/api/v1/user?phone=${phoneNumber}`
      );
      const userId = userResponse.data._id; // uncomment this line

      // Fetch the appointment details using the user ID
      const appointmentResponse = await axios.get(
        `http://localhost:5000/api/v1/appointment/${userId}`
      );

      setAppointment(appointmentResponse.data.appointment);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookAppointment = async (slotId) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const phoneNumber = localStorage.getItem("phone");

      const response = await axios.post(
        "http://localhost:5000/api/v1/appointment",
        {
          userPhone: phoneNumber,
          slotId: slotId,
        }
      );

      if (response.status === 201) {
        // Booking successful
        toast.success("Your slot is booked!");
        // Refresh slots and bookings after booking
        fetchSlots();
        fetchAppointment();
      } else {
        // Booking failed
        toast.error("Failed to book the slot.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while booking the slot.");
    }
  };

  const handleCancelAppointment = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.delete(
        `http://localhost:5000/api/v1/appointment/bookings/${bookingId}`
      );

      if (response.status === 200) {
        // Cancellation successful
        toast.success("Appointment cancelled successfully!");
        // Refresh bookings after cancellation
        fetchAppointment();
      } else {
        // Cancellation failed
        toast.error("Failed to cancel the appointment.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while cancelling the appointment.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Your Bookings</h2>
      <div className="overflow-x-auto mb-4">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Phone Number</th>
              <th className="border px-4 py-2">Time Slot</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {appointment.map((booking) => (
              <tr key={booking._id}>
                <td className="border px-4 py-2">{booking.userName}</td>
                <td className="border px-4 py-2">{booking.userPhone}</td>
                <td className="border px-4 py-2">
                  {booking.slot.startTime} - {booking.slot.endTime}
                </td>
                <td className="border px-4 py-2">Booked</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded"
                    onClick={() => handleCancelAppointment(booking._id)}
                  >
                    Cancel Appointment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-3xl font-bold mb-4">Today's Slots</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-center">Slot Number</th>
              <th className="border px-4 py-2 text-center">Time Slot</th>
              <th className="border px-4 py-2 text-center">Seats Left</th>
              <th className="border px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, index) => (
              <tr key={index}>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2 text-center">
                  {slot.startTime} - {slot.endTime}
                </td>
                <td className="border px-4 py-2 text-center">
                  {slot.capacity}
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2 rounded"
                    onClick={() => handleBookAppointment(slot._id)}
                  >
                    Book
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default BookAppointment;
