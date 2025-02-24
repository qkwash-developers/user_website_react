import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCheck } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import "./PaymentPage.css";

function PaymentPage() {
  const [showPopup, setShowPopup] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [razorpayScriptLoaded, setRazorpayScriptLoaded] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [offerPrice, setOfferPrice] = useState(0);
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  const usermobile = localStorage.getItem("usermobile");
  const username = localStorage.getItem("username");

  // Initialize the Razorpay SDK
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = import.meta.env.VITE_RAZORPAY_CHECKOUT_API;
      script.onload = () => setRazorpayScriptLoaded(true);
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  // Initialize payment details
  useEffect(() => {
    const selectedWashType = localStorage.getItem("selectedWashType");
    const selectedAmount = parseFloat(localStorage.getItem("selectedAmount"));
    const offerPrice =
      parseFloat(localStorage.getItem("selectedOfferAmount")) || 0;

    if (selectedWashType && selectedAmount) {
      setTableData([
        {
          noOfWash: "1x",
          typeOfWash: selectedWashType,
          amount: selectedAmount,
          offerPrice,
        },
      ]);
      setOfferPrice(offerPrice);
    }
  }, []);

  // ✅ Create Razorpay Order (Client-Side Order Creation)
  const createRazorpayOrder = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/createOrder`,
        {
          amount: offerPrice * 100, // Convert to paise
          userId: usermobile,
          // currency: "INR",
          // receipt: "rcptdid_11", // Unique receipt identifier
          // payment_capture: 1,
        }
        // {
        //   headers: {
        //     Authorization: `Basic ${btoa(
        //       import.meta.env.VITE_RAZORPAY_ID +
        //         ":" +
        //         import.meta.env.VITE_RAZORPAY_KEY
        //     )}`, // Razorpay API Key and Secret encoded in base64
        //   },
        // }
      );

      console.log("Order Created:", response.data); // Log the order details

      // Store the Razorpay order ID
      setOrderId(response.data.orderId);
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
    }
  };

  // Create Razorpay order once offerPrice is available
  useEffect(() => {
    if (offerPrice > 0) {
      createRazorpayOrder();
    }
  }, [offerPrice]);

  // ✅ Handle Payment Process
  const handlePayment = () => {
    if (!razorpayScriptLoaded) {
      alert("Razorpay SDK not loaded. Please try again.");
      return;
    }
    if (!orderId) {
      alert("Order ID not generated yet. Please wait.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_ID, // Razorpay Public Key
      amount: offerPrice * 100, // Amount in paise
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      order_id: orderId, // Razorpay Order ID
      handler: function (response) {
        console.log("Payment Response:", response);

        // Store the Razorpay response details
        localStorage.setItem(
          "razorpay_payment_id",
          response.razorpay_payment_id
        );
        localStorage.setItem("razorpay_order_id", response.razorpay_order_id); // Store order_id
        localStorage.setItem("razorpay_signature", response.razorpay_signature); // Store signature

        // Show success popup
        setShowPopup(false);
        setShowSuccessPopup(true);

        // Redirect after success
        setTimeout(() => navigate("/payment-detail"), 2000);
      },
      prefill: {
        name: username,
        email: "john.doe@example.com",
        contact: usermobile,
      },
      theme: { color: "#3399cc" },
    };

    // Open Razorpay payment modal
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="payment-page">
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <Link to="/Hub-details" className="close-popup">
              ✖
            </Link>
            <h1 className="popup-title">Mode & Payment Details</h1>

            <div className="table-container">
              <div className="table-header">
                <span>No of Wash</span> <span>Type Of Wash</span>{" "}
                <span>Amount</span> <span>Offer Price</span>
              </div>
              <hr className="header-divider" />
              <div className="table-content">
                {tableData.map((row, index) => (
                  <div key={index} className="table-row">
                    <span>{row.noOfWash}</span> <span>{row.typeOfWash}</span>{" "}
                    <span>₹{row.amount.toFixed(2)}</span>{" "}
                    <span>₹{row.offerPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="table-row total-row">
                <span></span> <span>Total</span>{" "}
                <span>₹{offerPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="payment-button-container">
              <button className="payment-button" onClick={handlePayment}>
                Pay ₹{offerPrice.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-shadow-circle">
              <FiCheck className="success-icon" />
            </div>
            <h2 className="success-message">Transaction Successful</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
