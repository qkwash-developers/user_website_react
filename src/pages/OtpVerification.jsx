import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./OtpVerification.css";
import { toast } from "react-toastify";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [username, setUsername] = useState("");
  const [usermobile, setUsermobile] = useState("");
  const [sessionToken, setSessionToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { otp: serverOtp, mobile } = location.state || {};

  // Refs for OTP inputs to manage focus
  const inputRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus on the next input box if the value is entered
      if (index < otp.length - 1 && value !== "") {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "") {
      // Focus on the previous input box if the current box is empty and Backspace is pressed
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/addOrUpdate`,
        {
          usermobile: usermobile,
          userstatus: "existing",
          username: username,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "User added or updated successfully") {
        const token = response.data.sessionToken;
        setSessionToken(token);
        localStorage.setItem("qkwashtoken", token);
        localStorage.setItem("username", username);
        localStorage.setItem("usermobile", usermobile);

        console.log("Profile updated successfully!");
        navigate("/");
      } else {
        console.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp === serverOtp) {
      toast.success("OTP Verified Successfully!");
      handleSave();
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUsermobile = localStorage.getItem("usermobile");
    const storedSessionToken = localStorage.getItem("qkwashtoken");

    if (storedUsername) setUsername(storedUsername);
    if (storedUsermobile) setUsermobile(storedUsermobile);
    if (storedSessionToken) setSessionToken(storedSessionToken);
  }, []);

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>OTP Verification</h2>
        <img
          src="https://miro.medium.com/v2/resize:fit:1000/1*nXgod8eI9Gslpi4oCfsDew.jpeg"
          alt="Verification"
          className="verification-image"
        />
        <p>
          OTP has been sent to the registered mobile number ending with{" "}
          {mobile ? mobile.slice(-4) : "****"}.
        </p>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleBackspace(index, e)} // Handle backspace key
              className="otp-input"
              ref={(el) => (inputRefs.current[index] = el)} // Assign ref to each input
            />
          ))}
        </div>
        <button onClick={handleVerify} className="verify-button">
          Submit
        </button>
        <p className="resend-text">
          Didn't receive OTP?{" "}
          <button className="resend-button">Resend OTP</button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
