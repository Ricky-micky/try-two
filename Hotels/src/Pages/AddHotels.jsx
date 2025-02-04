import React, { useState } from "react";

const AddHotels = () => {
  const [hotelData, setHotelData] = useState({
    name: "",
    location: "",
    description: "",
    image_url: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData({
      ...hotelData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage(""); // Reset previous message

    const { name, location } = hotelData;

    if (!name || !location) {
      setResponseMessage("Name and Location are required.");
      return;
    }

    try {
      const response = await fetch("https://try-two-5.onrender.com/hotels", {
        // Ensure correct API URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hotelData),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage("Hotel added successfully!");
        setHotelData({
          name: "",
          location: "",
          description: "",
          image_url: "",
        }); // Clear form
      } else {
        setResponseMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      setResponseMessage("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-4">
        Add Hotel
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Hotel Name
          </label>
          <input
            type="text"
            name="name"
            value={hotelData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter hotel name"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={hotelData.location}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter hotel location"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={hotelData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter hotel description"
            rows="3"
          ></textarea>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">
            Image URL (Optional)
          </label>
          <input
            type="url"
            name="image_url"
            value={hotelData.image_url}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter image URL"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700"
        >
          Add Hotel
        </button>
      </form>

      {responseMessage && (
        <p className="mt-4 text-center text-lg text-gray-700">
          {responseMessage}
        </p>
      )}
    </div>
  );
};

export default AddHotels;
