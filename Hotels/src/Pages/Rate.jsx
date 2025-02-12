import React, { useState } from "react";

function Rate() {
  const [rating, setRating] = useState(0); // Store the current rating
  const [hover, setHover] = useState(0); // Track hover state

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold text-gray-700 mb-2">Rate this Hotel</h2>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-8 h-8 cursor-pointer transition-transform ${
              (hover || rating) >= star
                ? "text-yellow-400 scale-110"
                : "text-gray-300"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        ))}
      </div>
      <p className="mt-3 text-sm text-gray-600">
        {rating > 0
          ? `You rated this hotel ${rating} out of 5.`
          : "Click on the stars to rate."}
      </p>
    </div>
  );
}

export default Rate;
