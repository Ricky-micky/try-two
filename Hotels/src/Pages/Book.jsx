import React, { useState } from "react";

function Book() {
  const [userId, setUserId] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const handleBooking = (e) => {
    e.preventDefault();

    const bookingData = {
      user_id: userId,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
    };

    fetch("/bookings", {
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
      .then((data) => alert(`Booking successful! ID: ${data.id}`))
      .catch((error) => alert("Error booking room: " + error.message));
  };

  return (
    <div>
      <h2>Book a Room</h2>
      <form onSubmit={handleBooking}>
        <label>User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />

        <label>Check-in Date:</label>
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          required
        />

        <label>Check-out Date:</label>
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          required
        />

        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

export default Book;
