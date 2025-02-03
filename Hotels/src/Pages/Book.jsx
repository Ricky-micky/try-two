import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Book = () => {
  const navigate = useNavigate();
  const { roomId } = useParams(); // Get the roomId from the URL
  const [room, setRoom] = useState(null);
  const [formData, setFormData] = useState({
    user_name: "",
    room_id: roomId,
    check_in_date: "",
    check_out_date: "",
    special_requests: "",
    total_price: 0,
  });

  // Fetch room details
  useEffect(() => {
    fetch(`http://localhost:5000/rooms/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        setRoom(data);
        setFormData((prev) => ({
          ...prev,
          room_id: data.id, // Ensure correct room_id
        }));
      })
      .catch((error) => console.error("Error fetching room details:", error));
  }, [roomId]);

  // Calculate total price
  useEffect(() => {
    if (formData.check_in_date && formData.check_out_date && room) {
      const checkInDate = new Date(formData.check_in_date);
      const checkOutDate = new Date(formData.check_out_date);
      const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
      const totalPrice = nights > 0 ? nights * room.price_per_night : 0;
      setFormData((prev) => ({ ...prev, total_price: totalPrice }));
    }
  }, [formData.check_in_date, formData.check_out_date, room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Booking confirmed!");
        navigate("/payment");
      })
      .catch((error) => {
        console.error("Error booking the room:", error);
      });
  };

  if (!room) {
    return <div className="text-center p-6">Loading room details...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Book Your Room
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="user_name"
          placeholder="Your Name"
          value={formData.user_name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md"
        />
        <div>
          <label>Room Type</label>
          <input
            type="text"
            value={room.type}
            disabled
            className="w-full p-3 border bg-gray-100"
          />
        </div>
        <div>
          <label>Check-in Date</label>
          <input
            type="date"
            name="check_in_date"
            value={formData.check_in_date}
            onChange={handleChange}
            required
            className="w-full p-3 border"
          />
        </div>
        <div>
          <label>Check-out Date</label>
          <input
            type="date"
            name="check_out_date"
            value={formData.check_out_date}
            onChange={handleChange}
            required
            className="w-full p-3 border"
          />
        </div>
        <div>
          <label>Special Requests</label>
          <textarea
            name="special_requests"
            placeholder="Any requests?"
            value={formData.special_requests}
            onChange={handleChange}
            className="w-full p-3 border"
          ></textarea>
        </div>
        <h3>Total Price: ${formData.total_price.toFixed(2)}</h3>
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-md"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default Book;
