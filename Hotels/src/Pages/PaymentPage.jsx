import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Modal from "react-modal";

Modal.setAppElement("#root");

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    totalPrice,
    selectedRoom,
    checkInDate,
    checkOutDate,
    guests,
    userId,
  } = location.state || {};

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");

  const openModal = (method) => {
    setSelectedMethod(method);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handlePayment = async (method) => {
    if (method === "Card" && (!cardNumber || !expiryDate || !cvv)) {
      Swal.fire({
        title: "Error",
        text: "Please fill in all card details.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // Step 1: Create a booking
      const bookingPayload = {
        user_id: userId, // Ensure userId is passed from location.state
        room_id: selectedRoom,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        guests,
        total_price: totalPrice,
        payment_method: method,
        card_details:
          method === "Card" ? { cardNumber, expiryDate, cvv } : null,
      };

      console.log("Sending booking payload:", bookingPayload); // Log the payload

      const bookingResponse = await fetch("https://try-two-5.onrender.com/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        throw new Error(errorData.error || "Booking failed.");
      }

      const bookingData = await bookingResponse.json();
      const bookingId = bookingData.id;

      // Step 2: Create a payment record
      const paymentPayload = {
        user_id: userId,
        booking_id: bookingId,
        amount: totalPrice,
        status: "pending", // Set status to 'pending' for hotel approval
      };

      console.log("Sending payment payload:", paymentPayload); // Log the payload

      const paymentResponse = await fetch("https://try-two-5.onrender.com/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(paymentPayload),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || "Payment record creation failed.");
      }

      const paymentData = await paymentResponse.json();

      // Step 3: Show success notification
      Swal.fire({
        title: "Payment Successful!",
        text: `Thank you for paying $${totalPrice} via ${method}. Your payment ID is ${paymentData.id}. Waiting for approval from the hotel.`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Step 4: Navigate back to the home page
        navigate("/");
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-500 to-teal-600 py-8 flex justify-center items-center">
      <div className="max-w-4xl bg-white p-8 rounded-lg shadow-2xl text-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-lg transition-all"
        >
          Back
        </button>

        <h1 className="text-4xl font-bold mb-6 text-gray-800">Payment</h1>
        <p className="text-xl text-gray-700">
          Total Amount:{" "}
          <span className="font-bold text-green-600">${totalPrice}</span>
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Card Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-8">
          <button
            onClick={() => openModal("M-Pesa")}
            className="btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg transition-all"
          >
            Pay with M-Pesa
          </button>
          <button
            onClick={() => openModal("Cash")}
            className="btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-lg transition-all"
          >
            Pay with Cash
          </button>
          <button
            onClick={() => openModal("Card")}
            className="btn bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md shadow-lg transition-all"
          >
            Pay with Card
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Payment Details Modal"
        className="modal bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20"
      >
        <h2 className="text-2xl font-bold mb-4">
          {selectedMethod} Payment Details
        </h2>
        {selectedMethod === "M-Pesa" && (
          <div>
            <div className="my-8 p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg border border-white/20">
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500 animate-pulse">
                An OTP will be sent to your phone number
              </h1>
              <h2 className="mt-2 text-lg md:text-xl text-white/90 font-semibold">
                This is through our paybill No:
                <span className="ml-2 text-yellow-300 font-bold">123456</span>
              </h2>
            </div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile No:
            </label>
            <input
              type="text"
              placeholder="Enter the your mobile "
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>
        )}
        {selectedMethod === "Cash" && (
          <div>
            <p>Please pay with cash at the reception.</p>
          </div>
        )}
        {selectedMethod === "Card" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
            <label className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
            <label className="block text-sm font-medium text-gray-700">
              CVV
            </label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>
        )}
        <div className="flex justify-end mt-6">
          <button
            onClick={closeModal}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-lg mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handlePayment(selectedMethod);
              closeModal();
            }}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-lg"
          >
            Confirm Payment
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default PaymentPage;
