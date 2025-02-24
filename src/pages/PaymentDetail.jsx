import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./PaymentDetail.css";

const PaymentDetail = () => {
  const [showContinuePopup, setShowContinuePopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const apiEndpoint = `${import.meta.env.VITE_API_URL}/hubs/hubs/book`;

  const totalAmount = localStorage.getItem("selectedOfferAmount");

  const transactionData = {
    transactionId: "#987654321",
    modeOfPayment: "Credit Card",
    status: "Complete",
    date: "2024-12-10",
    time: "10:30 AM",
    totalAmount,
  };

  const handleContinue = async () => {
    const hubId = localStorage.getItem("hubId");
    const deviceId = localStorage.getItem("deviceId");
    const paymentId = localStorage.getItem("razorpay_payment_id");
    const washMode = localStorage.getItem("selectedWashType");
    const userMobile = localStorage.getItem("usermobile");
    const sessionToken = localStorage.getItem("qkwashtoken");
    const transactionamount = localStorage.getItem("selectedOfferAmount");
    const device_booked_user_start_time = localStorage.getItem(
      "device_booked_user_start_time"
    );
    const device_booked_user_end_time = localStorage.getItem(
      "device_booked_user_end_time"
    );
    const booked_user_selected_duration = localStorage.getItem("wash_time");

    // just for checking everything
    if (
      !hubId ||
      !deviceId ||
      !paymentId ||
      !washMode ||
      !userMobile ||
      !sessionToken
    ) {
      alert("Required data missing in session storage!");
      return;
    }

    // const apiEndpoint = `${import.meta.env.VITE_API_URL}/hubs/hubs/book`;
    const payload = {
      hubid: hubId,
      deviceid: deviceId,
      devicestatus: "Booked",
      device_booked_user_mobile_no: userMobile,
      device_booked_user_start_time,
      device_booked_user_end_time,
      booked_user_selected_wash_mode: washMode,
      booked_user_selected_duration,
      paymentid: paymentId,
      transactionamount,
      sessiontoken: sessionToken,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(apiEndpoint, payload);
      console.log("API Response:", response.data);

      if (response.data) {
        alert("Machine has been booked successfully!");
        //  success or home page
        // navigate('/Home');
      } else {
        alert("machine booking not completed");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }

    setShowContinuePopup(true);
  };

  const handleStart = async () => {
    const hubId = localStorage.getItem("hubId");
    const deviceId = localStorage.getItem("deviceId");
    const paymentId = localStorage.getItem("razorpay_payment_id");
    const washMode = localStorage.getItem("selectedWashType");
    const userMobile = localStorage.getItem("usermobile");
    const sessionToken = localStorage.getItem("qkwashtoken");
    const transactionamount = localStorage.getItem("selectedOfferAmount");
    const device_booked_user_start_time = localStorage.getItem(
      "device_booked_user_start_time"
    );
    const device_booked_user_end_time = localStorage.getItem(
      "device_booked_user_end_time"
    );
    const booked_user_selected_duration = localStorage.getItem("wash_time");

    // just for checking everything
    if (
      !hubId ||
      !deviceId ||
      !paymentId ||
      !washMode ||
      !userMobile ||
      !sessionToken
    ) {
      alert("Required data missing in session storage!");
      return;
    }

    // const apiEndpoint = `${import.meta.env.VITE_API_URL}/hubs/hubs/book`;
    const payload = {
      hubid: hubId,
      deviceid: deviceId,
      devicestatus: 0,
      device_booked_user_mobile_no: userMobile,
      device_booked_user_start_time,
      device_booked_user_end_time,
      booked_user_selected_wash_mode: washMode,
      booked_user_selected_duration,
      paymentid: paymentId,
      transactionamount,
      sessiontoken: sessionToken,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(apiEndpoint, payload);
      console.log("API Response:", response.data);

      if (response.data) {
        alert("Machine has started successfully!");
      } else {
        alert("machine has not started");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="payment-detail-page">
      <div className="receipt-popup">
        <div className="receipt-header">
          <h2>Payment Receipt</h2>
        </div>
        <div className="receipt-content">
          <div className="receipt-row">
            <span>Transaction ID:</span>
            <span>{transactionData.transactionId}</span>
          </div>
          <div className="receipt-row">
            <span>Mode of Payment:</span>
            <span>{transactionData.modeOfPayment}</span>
          </div>

          <div className="receipt-row">
            <span>Status:</span>
            <span className="status-complete">{transactionData.status}</span>
          </div>

          <div className="receipt-row">
            <span>Date:</span>
            <span>{transactionData.date}</span>
          </div>
          <div className="receipt-row">
            <span>Time:</span>
            <span>{transactionData.time}</span>
          </div>
          <div className="receipt-row">
            <span>Total Amount:</span>
            <span>₹{transactionData.totalAmount}</span>
          </div>
        </div>
        <div className="receipt-footer">
          <Link to="" className="continue-button" onClick={handleContinue}>
            {isLoading ? "Processing..." : "Continue"}
          </Link>
        </div>
      </div>

      {showContinuePopup && (
        <div className="continue-popup-overlay">
          <div className="continue-popup">
            <h2>Load Your Clothes</h2>
            <p>Apply washing liquid, close the door.</p>
            <Link to="/Home" className="start-button" onClick={handleStart}>
              Start
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetail;
