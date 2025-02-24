import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Assuming you're using axios for API calls
import "./Login.css";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!mobile) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    if (!name) {
      newErrors.name = "Name is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to generate the session token with expiration (7 days)
  const generateSessionToken = () => {
    const array = new Uint8Array(6);
    window.crypto.getRandomValues(array);

    const token = Array.from(array, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");

    // const currentDate = new Date();

    // const expirationDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Create a token object that includes the expiration time
    const tokenWithExpiration = {
      token,
      // expiresAt: expirationDate.toISOString(), // Store expiration date as ISO string
    };

    return tokenWithExpiration;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulating API call for OTP sending
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login/send-otp`,
        {
          usermobile: mobile,
        }
      );

      const data = response.data;

      if (response.status === 200 && data.message === "OTP sent successfully") {
        const sessionTokenObj = generateSessionToken(); // Generate the session token with expiration

        // Store the session token, user data, and expiration date in localStorage
        // localStorage.setItem("qkwashtoken", sessionTokenObj.token);
        // localStorage.setItem("sessiontoken_expiration", sessionTokenObj.expiresAt);
        localStorage.setItem("usermobile", mobile);
        localStorage.setItem("username", name);
        localStorage.setItem("userType", data.user_type);
        localStorage.setItem("OTP", data.otp);

        // Navigate to OTP verification page with the necessary data
        navigate("/otp-verification", {
          state: { mobile, otp: data.otp, userType: data.user_type },
        });
      } else {
        alert(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("An error occurred while sending OTP. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container2">
      <div className="login-box">
        <div className="image-section">
          <img
            src="https://img.freepik.com/free-vector/hand-drawn-innovation-concept-with-ideas_23-2149153088.jpg"
            alt="Login Visual"
            className="login-image"
          />
        </div>
        <div className="login-section">
          <h1
            id="poppinsFont"
            style={{ textAlign: "center", color: "#0E7EC4", fontSize: "3em" }}
          >
            qk wash
          </h1>
          <h2 style={{ textAlign: "center" }}>Scan : Pay : Wash : Move</h2>
          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <div className="input-group">
              <input
                type="text"
                placeholder="Mobile Number"
                className="input-field"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              {errors.mobile && <span className="error-text">{errors.mobile}</span>}
            </div> */}
            <div
              className="input-group"
              style={{ width: "100%", marginLeft: "20px" }}
            >
              <input
                type="text"
                placeholder="Name"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            <div
              className="input-group"
              style={{ width: "100%", marginLeft: "20px" }}
            >
              <input
                type="text"
                placeholder="Mobile Number"
                className="input-field"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              {errors.mobile && (
                <span className="error-text">{errors.mobile}</span>
              )}
            </div>
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Sending OTP..." : "Login"}
            </button>
            <p
              style={{
                fontSize: "12px",
                textAlign: "center",
                color: "gray",
                fontFamily: "sans-serif",
              }}
            >
              By clicking, I accept the terms of services and privacy policy
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
