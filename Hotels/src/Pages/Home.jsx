import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./login";

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("access_token");

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("http://localhost:5000/rooms")
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error("Error fetching rooms:", error));
  }, [isAuthenticated]);

  const filteredRooms = rooms.filter((room) =>
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Available Rooms</h1>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search room types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div key={room.id} className="border rounded-lg p-4 shadow-md">
              <img
                src={room.image_url}
                alt={room.type}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h2 className="text-xl font-semibold mt-2">{room.type}</h2>
              <p className="text-gray-600">
                Price per Night: ${room.price_per_night}
              </p>
              <p
                className={`mt-1 ${
                  room.available ? "text-green-600" : "text-red-600"
                }`}
              >
                {room.available ? "Available" : "Not Available"}
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                onClick={() =>
                  navigate(`/book`, {
                    state: {
                      roomId: room.id,
                      pricePerNight: room.price_per_night,
                    },
                  })
                }
              >
                Book Now
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No rooms found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
