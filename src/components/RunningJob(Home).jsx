import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RunningJob(Home).css";

const RunningJob = () => {
  const [runningJobs, setRunningJobs] = useState([]);
  const [error, setError] = useState(null);
  const [endTime, setEndTime] = useState(null); // State for end time

  useEffect(() => {
    // Retrieve end time from session storage
    const storedEndTime = localStorage.getItem("device_booked_user_end_time");
    if (storedEndTime) {
      setEndTime(storedEndTime);
    }

    const fetchRunningJobs = async () => {
      const usernumber = localStorage.getItem("usermobile");
      const sessiontoken = localStorage.getItem("qkwashtoken");

      if (!usernumber || !sessiontoken) {
        setError("User not authenticated. Please log in again.");
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/runningjobs`,
          {
            usermobile: usernumber,
            sessiontoken: sessiontoken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setRunningJobs(response.data);
      } catch (err) {
        console.error("Error:", err);
        if (err.response) {
          if (err.response.status === 401) {
            setError("Session expired or invalid. Please log in again.");
          } else {
            setError(
              err.response?.data?.message || err.message || "An error occurred."
            );
          }
        } else {
          setError("An error occurred. Please try again later.");
        }
      }
    };

    fetchRunningJobs();
  }, []); // Runs on component mount

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="container-runningjob">
      {Array.isArray(runningJobs) && runningJobs.length > 0 ? (
        runningJobs.slice(0, 2).map((job, index) => {
          // Limit to two boxes
          const hasError =
            job.devicestatus !== job.devicestatus ||
            job.devicestatus < 0 ||
            job.devicestatus > 100;

          return (
            <div className="box-runningjob" key={index}>
              <div className="box-content-runningjob">
                <div className="hub-details-runningjob">
                  <p className="hub-name-runningJob">Hub Name</p>
                  <p className="hub-subtext-runningjob">{job.hubname}</p>
                </div>
                <div className="machine-details-runningjob">
                  <p className="machine-name-runningjob">Machine Name</p>
                  <p className="machine-subtext-runningjob">{job.deviceid}</p>
                </div>
                <div className="Time">
                  <p className="End-Time">End Time</p>
                  <p className="machine-subtext">
                    {new Date(
                      job.device_booked_user_end_time
                    ).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Kolkata", // Ensures IST timezone
                    })}{" "}
                  </p>{" "}
                  {/* Display session storage end time if available */}
                </div>
              </div>
              <div className="loader-container">
                {hasError ? (
                  <div className="error-circle">
                    <div className="error-message">Stopped!</div>
                  </div>
                ) : (
                  <div className="circular-progress">
                    <svg className="progress-svg" viewBox="0 0 100 100">
                      <circle
                        className="progress-background"
                        cx="50"
                        cy="50"
                        r="45"
                      />
                      <circle
                        className="progress-bar"
                        cx="50"
                        cy="50"
                        r="45"
                        style={{
                          strokeDashoffset:
                            282.6 - (282.6 * job.devicestatus) / 100,
                        }}
                      />
                    </svg>
                    <div className="progress-percentage">
                      {job.devicestatus}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div
          style={{
            width: "70vw",
            height: "40vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "500",
              textAlign: "center",
              color: "black",
            }}
          >
            No Running Jobs Available
          </h1>
        </div>
      )}
    </div>
  );
};

export default RunningJob;
