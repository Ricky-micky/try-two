import React from "react";

function Ricky() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 text-white flex items-center justify-center py-10">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h3>Logged Out ! </h3>
        <h1 className="text-6xl font-bold mb-6 leading-tight tracking-wide">
          Dreaming of Your Perfect Getaway?
        </h1>
        <p className="text-lg mb-10 text-opacity-90">
          Discover luxury stays, stunning views, and unforgettable experiences.
          Book your dream hotel today.
        </p>

        <div className="bg-white text-gray-800 p-8 rounded-xl shadow-2xl transform hover:scale-105 transition duration-500 ease-in-out">
          <h2 className="text-3xl font-semibold mb-4 text-blue-600">
            Exclusive Offers
          </h2>
          <p className="text-lg mb-8">
            Choose from a wide range of rooms with world-class amenities and
            facilities, designed just for you!
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-xl transition duration-300 transform hover:scale-105">
            Book Your Stay Now
          </button>
        </div>

        <div className="mt-12">
          <h3 className="text-4xl font-semibold text-blue-200 mb-4">
            Why Choose Us?
          </h3>
          <ul className="space-y-4 text-lg">
            <li>⭐ Luxury Rooms & Suites</li>
            <li>🌅 Stunning Views</li>
            <li>🍽 Gourmet Dining Experiences</li>
            <li>🌐 24/7 Customer Support</li>
            <li>🏖️ Unforgettable Destinations</li>
          </ul>
        </div>

        <div className="mt-8 text-gray-300">
          <p className="text-sm">Your next adventure awaits! Don't miss out.</p>
        </div>
      </div>
    </div>
  );
}

export default Ricky;
