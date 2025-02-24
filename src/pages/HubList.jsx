import React, { useEffect, useState } from "react";
import SideMenu from "../components/SideMenu";
import "./HubList.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaLocationArrow } from "react-icons/fa";

const HubList = () => {
  const [hubDetails, setHubDetails] = useState(null);
  const [selectedHubDetails, setSelectedHubDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [washTime, setWashTime] = useState("15"); // Default wash time
  const [endTime, setEndTime] = useState(""); // Store device_booked_user_end_time
  const [validationMessage, setValidationMessage] = useState("");

  const hubId = localStorage.getItem("hubId"); // Retrieve the hubId from session storage

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedHubDetails(null); // Reset selected hub details
  };

  const fetchAmount = async (washType) => {
    const usermobile = localStorage.getItem("usermobile");
    const sessionToken = localStorage.getItem("qkwashtoken");

    if (!usermobile || !sessionToken) {
      setError("User not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/hubs/hubs/details`,
        {
          hubId,
          usermobile,
          sessionToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const hubData = response.data;
      const amount =
        washType === "Quick Wash"
          ? hubData[0]?.actual_quick_amount
          : hubData[0]?.actual_steam_amount;

      const offerAmount =
        washType === "Quick Wash"
          ? hubData[0]?.offer_quick_amount
          : hubData[0]?.offer_steam_amount;

      localStorage.setItem("selectedAmount", amount);
      localStorage.setItem("selectedOfferAmount", offerAmount);
      localStorage.setItem("selectedWashType", washType);

      // Calculate and store device_booked_user_end_time
      const washTimeMinutes = washType === "Quick Wash" ? 30 : 55;
      localStorage.setItem("wash_time", washTimeMinutes);

      const currentTime = new Date();
      const endTime = new Date(currentTime.getTime() + washTimeMinutes * 60000);

      const formattedStartTime = currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const formattedEndTime = endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // localStorage.setItem(
      //   "device_booked_user_start_time",
      //   currentTime.toLocaleString()
      // );
      // // localStorage.setItem("device_booked_user_end_time", formattedEndTime);
      // localStorage.setItem(
      //   "device_booked_user_end_time",
      //   endTime.toLocaleString()
      // );

      localStorage.setItem(
        "device_booked_user_start_time",
        currentTime.toISOString()
      );
      localStorage.setItem(
        "device_booked_user_end_time",
        endTime.toISOString()
      );

      console.log(formattedStartTime + " is the start time");
      console.log(formattedEndTime + " is the end time");
      setEndTime(formattedEndTime);
    } catch (err) {
      console.error("Error fetching amount:", err);
      setError("Failed to fetch the amount. Please try again.");
    }
  };

  useEffect(() => {
    if (hubId) {
      const fetchHubDetails = async () => {
        const usermobile = localStorage.getItem("usermobile");
        const sessionToken = localStorage.getItem("qkwashtoken");

        if (!usermobile || !sessionToken) {
          setError("User not authenticated. Please log in.");
          return;
        }

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/hubs/hubs/details`,
            {
              hubId,
              usermobile,
              sessionToken,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const hubData = response.data;
          setHubDetails(hubData);

          // const deviceId = hubData[0]?.deviceid;
          // localStorage.setItem("hubid", hubId);
          // localStorage.setItem("deviceid", deviceId);

          setError(null);
        } catch (err) {
          console.error("Error fetching hub details:", err);
          setError("Failed to fetch hub details. Please try again.");
        }
      };

      fetchHubDetails();
    }
  }, [hubId]);

  const handleWashSelection = (washType) => {
    setSelectedButton(washType === "Quick Wash" ? 0 : 1);
    fetchAmount(washType);
    if (washType === "Quick Wash") {
      setWashTime("30"); // 30 min for Quick Wash
    } else if (washType === "Heavy Wash") {
      setWashTime("55"); // 55 min for Heavy Wash
    }
  };

  const handleContinueClick = (deviceId) => {
    console.log(deviceId + " is device id `````````````");
    localStorage.setItem("deviceId", deviceId);
    if (selectedButton === null) {
      setValidationMessage("Select one wash method");
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!hubDetails) {
    return <div>Loading hub details...</div>;
  }

  return (
    <div>
      <SideMenu />

      <div className="container-location">
        <div className="glass-box-hub">
          <div className="icon-hub">
            <FaLocationArrow />
          </div>
          <span className="text-hub">
            {hubDetails[0]?.hubname || "Hub Location"}
          </span>
        </div>
      </div>

      <div className="container-Hub">
        {hubDetails.map((hub, index) => {
          // Determine the button text for the current hub
          const currentButtonText =
            hub.devicecondition === "Maintenance" ||
            hub.devicecondition === "Not Working"
              ? "Unavailable"
              : hub.devicecondition === "Good" && hub.devicestatus === "Ready"
              ? "Book"
              : "Unavailable";

          return (
            <div className="box-Hub" key={index}>
              <div className="circle-Hub">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/125/125652.png"
                  alt="Circle Icon"
                  className="circle-image"
                />
              </div>
              <div className="Name">{hub.devicetype || "Machine Name"}</div>
              <div className="sub-Name">{hub.deviceid || "Machine ID"}</div>
              {hub.devicecondition === "Maintenance" ? (
                <p id="deviceConditionText">
                  {" "}
                  Device is under {hub.devicecondition}
                </p>
              ) : (
                ""
              )}
              {hub.devicecondition === "Not Working" ? (
                <p id="deviceConditionText"> Device is {hub.devicecondition}</p>
              ) : (
                ""
              )}
              {hub.devicecondition === "Good" &&
              hub.devicestatus !== "Ready" ? (
                <p id="deviceStatusText">
                  Available at :{" "}
                  {new Date(hub.device_booked_user_end_time).toLocaleString()}
                </p>
              ) : (
                ""
              )}
              <button
                className={`button-Hub ${
                  currentButtonText === "Unavailable"
                    ? "disabled unavailable-button"
                    : "available-button"
                }`}
                onClick={() => {
                  if (currentButtonText === "Book") {
                    setSelectedHubDetails(hub);
                    setPopupVisible(true);
                  }
                }}
                // disabled={currentButtonText === "Unavailable"}
              >
                {currentButtonText}
              </button>
            </div>
          );
        })}

        {isPopupVisible && selectedHubDetails && (
          <div className="popup-overlay-hublist">
            <div className="popup">
              <button className="close-button" onClick={handleClosePopup}>
                ✖
              </button>

              <div className="popup-header">
                <div className="popup-left">
                  <h2 className="title">
                    {selectedHubDetails?.hubname || "Machine Name"}
                  </h2>
                  <div className="machine-info">
                    <p className="label">Machine ID</p>
                    <p className="subtext">
                      {selectedHubDetails?.deviceid || "ID not available"}
                    </p>
                  </div>
                </div>
                <div className="popup-job">Next Job</div>
                <div className="popup-right">
                  <p className="status-hub">
                    {selectedHubDetails?.devicestatus || "Status unavailable"}
                  </p>
                </div>
              </div>

              <div className="button-group">
                {["Quick Wash", "Heavy Wash"].map((text, index) => (
                  <button
                    key={index}
                    className={`select-button ${
                      selectedButton === index ? "selected" : ""
                    }`}
                    onClick={() => handleWashSelection(text)}
                  >
                    {text}
                  </button>
                ))}
              </div>

              <div className="button-group1">
                <button className="select-button2">
                  {`${washTime} min Wash Time`}
                </button>
                <p className="end-time">End Time: {endTime}</p>
              </div>

              {validationMessage && (
                <div className="validation-message">{validationMessage}</div>
              )}

              <Link
                to={selectedButton !== null ? "/payment" : "#"}
                className={`continue-buttonn ${
                  selectedButton === null ? "disabled" : ""
                }`}
                onClick={() =>
                  handleContinueClick(selectedHubDetails?.deviceid)
                }
              >
                Continue
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HubList;
