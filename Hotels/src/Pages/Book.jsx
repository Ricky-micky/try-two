import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Book() {
  const location = useLocation();
  const { roomId, pricePerNight } = location.state || {};
  const [userId, setUserId] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const navigate = useNavigate();

  const calculateTotalPrice = (startDate, endDate, pricePerNight) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return nights * pricePerNight;
  };

  const handleBooking = (e) => {
    e.preventDefault();

    const totalPrice = calculateTotalPrice(
      checkInDate,
      checkOutDate,
      pricePerNight
    );

    const bookingData = {
      user_id: userId,
      room_id: roomId,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      totalPrice,
    };

    fetch("http://127.0.0.1:5000/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Booking failed.");
        }
        return response.json();
      })
      .then((data) => {
        alert(`Booking successful! ID: ${data.id}`);
        navigate("/paymentpage", {
          state: {
            userId,
            selectedRoom: roomId,
            checkInDate,
            checkOutDate,
            totalPrice,
          },
        });
      })
      .catch((error) => alert("Error booking room: " + error.message));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-105 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
          Book a Room
        </h2>
        <form onSubmit={handleBooking} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User ID:
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Check-in Date:
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Check-out Date:
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-md shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default Book;
