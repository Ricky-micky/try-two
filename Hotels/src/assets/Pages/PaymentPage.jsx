import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalPrice, selectedRoom, checkInDate, checkOutDate, guests } =
    location.state || {};

  const handlePayment = (method) => {
    // Send booking data to backend
    fetch("http://127.0.0.1:5000/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify({
        room_id: selectedRoom,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        guests,
        total_price: totalPrice,
        payment_method: method,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.fire({
          title: "Payment Successful!",
          text: `Thank you for paying $${totalPrice} via ${method}.`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/"); // Redirect to homepage
        });
      })
      .catch((error) => console.error("Error processing payment:", error));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-500 to-teal-600 py-8 flex justify-center items-center">
      <div className="max-w-4xl bg-white p-8 rounded-lg shadow-2xl text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Payment</h1>
        <p className="text-xl text-gray-700">
          Total Amount:{" "}
          <span className="font-bold text-green-600">${totalPrice}</span>
        </p>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <button
            onClick={() => handlePayment("M-Pesa")}
            className="btn bg-blue-500"
          >
            Pay with M-Pesa
          </button>
          <button
            onClick={() => handlePayment("Cash")}
            className="btn bg-green-500"
          >
            Pay with Cash
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
