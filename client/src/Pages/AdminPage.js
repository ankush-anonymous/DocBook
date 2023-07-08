import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";

const AdminPage = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [slots, setSlots] = useState([]);
  const [currentDaySlots, setCurrentDaySlots] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date().toLocaleDateString("en-GB");

  const todaySlots = slots.filter((slot) => {
    const slotDate = new Date(slot.date).toLocaleDateString("en-GB");
    return slotDate === today;
  });

  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
      }, 30000); // 30 seconds
    };

    const activityHandler = () => {
      resetTimer();
    };

    document.addEventListener("mousemove", activityHandler);
    document.addEventListener("keypress", activityHandler);

    resetTimer();

    return () => {
      document.removeEventListener("mousemove", activityHandler);
      document.removeEventListener("keypress", activityHandler);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const fetchCurrentDaySlots = async () => {
      try {
        const formattedCurrentDate = format(currentDate, "yyyy-MM-dd");
        const response = await axios.get(
          `http://localhost:5000/api/v1/slots?date=${formattedCurrentDate}`
        );
        const { slots } = response.data;
        setCurrentDaySlots(slots);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchSlots = async () => {
      try {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await axios.get("http://localhost:5000/api/v1/slots");
        const { slots } = response.data;

        setSlots(slots);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentDaySlots();
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get("http://localhost:5000/api/v1/slots");
      const { slots } = response.data;

      setSlots(slots);
    } catch (error) {
      console.error(error);
    }
  };

  const createSlot = async (e) => {
    e.preventDefault();

    if (!date || !startTime || !endTime || !capacity) {
      toast.error("Please fill in all the details");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to 00:00:00

    // Calculate the date four days from today
    const fourDaysFromToday = new Date();
    fourDaysFromToday.setDate(today.getDate() + 4);
    fourDaysFromToday.setHours(23, 59, 59, 999); // Set the time to 23:59:59.999

    // Convert the selected date to a Date object
    const selectedDate = new Date(date);

    // Check if the selected date is within the allowed range
    if (selectedDate < today || selectedDate > fourDaysFromToday) {
      toast.error("You can only create slots for today and the next four days");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const newSlot = {
        date,
        day: fetchDayFromSelectedDate(date), // Fetch the day based on the selected date
        startTime,
        endTime,
        capacity,
      };

      const response = await axios.post(
        "http://localhost:5000/api/v1/slots",
        newSlot
      );
      console.log(response.data); // Optionally, you can handle the response as needed

      toast.success("Slot created successfully");
      fetchSlots();

      // Clear the form after successful submission
      setDate("");
      setDay("");
      setStartTime("");
      setEndTime("");
      setCapacity("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSlot = async (slotId) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.delete(`http://localhost:5000/api/v1/slots/${slotId}`);
      // Fetch slots data again to update the list
      fetchSlots();
      toast.success("Slot deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const groupSlotsByDay = (slots) => {
    return slots.reduce((groupedSlots, slot) => {
      const { day } = slot;
      if (groupedSlots[day]) {
        groupedSlots[day].push(slot);
      } else {
        groupedSlots[day] = [slot];
      }
      return groupedSlots;
    }, {});
  };

  // Function to sort slots by start time
  const sortSlotsByStartTime = (slotA, slotB) => {
    const startTimeA = new Date(`1970-01-01T${slotA.startTime}`);
    const startTimeB = new Date(`1970-01-01T${slotB.startTime}`);
    return startTimeA - startTimeB;
  };

  // Function to sort days
  const sortDays = ([dayA], [dayB]) => {
    const daysOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return daysOrder.indexOf(dayA) - daysOrder.indexOf(dayB);
  };
  const fetchDayFromSelectedDate = (selectedDate) => {
    const dateObj = new Date(selectedDate);
    const dayIndex = dateObj.getDay();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const selectedDay = days[dayIndex];
    return selectedDay;
  };

  const deleteSlotsOfExpiredDay = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch all slots
      const response = await axios.get("http://localhost:5000/api/v1/slots");
      const { slots } = response.data;

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Filter the slots whose date is less than today's date
      const outdatedSlots = slots.filter((slot) => slot.date < today);

      // Delete the outdated slots
      for (const slot of outdatedSlots) {
        // console.log(slot._id);
        await axios.delete(`http://localhost:5000/api/v1/slots/${slot._id}`);
      }

      // console.log("Deletion completed successfully");
    } catch (error) {
      console.error("Failed to fetch and delete slots:", error);
    }
  };

  // Run the deleteSlotsOfExpiredDay function when the component mounts
  useEffect(() => {
    deleteSlotsOfExpiredDay();
  }, []);

  const logout = () => {
    localStorage.removeItem("authorised");
    navigate("/authadmin");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <ToastContainer />
      <header className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Hi Admin</h1>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded focus:outline-none"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <section className="bg-white rounded-lg shadow-md p-6 mb-5">
          <h2 className="text-lg font-semibold mb-4">Today's Slots</h2>
          {todaySlots.length === 0 ? (
            <p>No slots available for today.</p>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Time Slot</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todaySlots.sort(sortSlotsByStartTime).map((slot) => (
                  <tr key={slot.id}>
                    <td className="px-4 py-2 border text-center">
                      {new Date(slot.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {slot.startTime} - {slot.endTime}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <div>
                        <button
                          type="button"
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => deleteSlot(slot._id)} // Pass slot._id as parameter to deleteSlot
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create Slot</h2>
          <form>
            {/* Slot creation form fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-5 text-lg"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-5 text-lg"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-5 text-lg"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="capacity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Capacity
                </label>
                <input
                  type="number"
                  id="capacity"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-5 text-lg"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="button"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={createSlot}
            >
              Create
            </button>
          </form>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">All Slots</h2>
          {Object.entries(groupSlotsByDay(slots))
            .sort(sortDays)
            .map(([day, daySlots]) => (
              <div key={day}>
                <h3 className="text-xl font-semibold mb-2">{day}</h3>
                {daySlots.length === 0 ? (
                  <p>No slots available for {day}.</p>
                ) : (
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border">Date</th>
                        <th className="px-4 py-2 border">Time Slot</th>
                        <th className="px-4 py-2 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {daySlots.sort(sortSlotsByStartTime).map((slot) => (
                        <tr key={slot.id}>
                          <td className="px-4 py-2 border text-center">
                            {new Date(slot.date).toLocaleDateString("en-GB")}
                          </td>
                          <td className="px-4 py-2 border text-center">
                            {slot.startTime} - {slot.endTime}
                          </td>
                          <td className="px-4 py-2 border text-center">
                            <div>
                              <button
                                type="button"
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                onClick={() => deleteSlot(slot._id)} // Pass slot._id as parameter to deleteSlot
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Hospital Name. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminPage;
