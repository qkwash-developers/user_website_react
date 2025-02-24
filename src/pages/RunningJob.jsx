// import React, { useEffect, useState } from "react";
// import "./RunningJob.css";
// import SideMenu from "../components/SideMenu";
// import axios from "axios";

// const RunningJob = () => {
//   const [runningJobs, setRunningJobs] = useState([]);
//   const [error, setError] = useState(null);
//   const [notifiedJobs, setNotifiedJobs] = useState(new Set()); // Track which jobs have triggered notifications

//   useEffect(() => {
//     const fetchRunningJobs = async () => {
//       const usernumber = localStorage.getItem("usermobile");
//       const sessiontoken = localStorage.getItem("qkwashtoken");

//       if (!usernumber || !sessiontoken) {
//         setError("User not authenticated. Please log in again.");
//         return;
//       }

//       try {
//         const response = await axios.post(
//           `${import.meta.env.VITE_API_URL}/user/runningjobs`,
//           {
//             usermobile: usernumber,
//             sessiontoken: sessiontoken,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         console.log("Response Data:", response.data);
//         setRunningJobs(response.data);

//         // Check progress for notifications
//         response.data.forEach((job) => {
//           if (
//             job.devicestatus >= 90 &&
//             !notifiedJobs.has(`${job.deviceid}-90`)
//           ) {
//             sendNotification(
//               "Wash is almost over",
//               `Machine ${job.deviceid} is at 90% progress.`
//             );
//             setNotifiedJobs((prev) => new Set(prev).add(`${job.deviceid}-90`));
//           }

//           if (
//             job.devicestatus === 100 &&
//             !notifiedJobs.has(`${job.deviceid}-100`)
//           ) {
//             sendNotification(
//               "Wash Ended",
//               `Machine ${job.deviceid} has completed the wash.`
//             );
//             setNotifiedJobs((prev) => new Set(prev).add(`${job.deviceid}-100`));
//           }
//         });
//       } catch (err) {
//         console.error("Error:", err);
//         if (err.response) {
//           if (err.response.status === 401) {
//             setError("Session expired or invalid. Please log in again.");
//           } else {
//             setError(
//               err.response?.data?.message || err.message || "An error occurred."
//             );
//           }
//         } else {
//           setError("An error occurred. Please try again later.");
//         }
//       }
//     };

//     fetchRunningJobs();
//     const interval = setInterval(fetchRunningJobs, 5000); // Polling every 5 seconds

//     return () => clearInterval(interval);
//   }, [notifiedJobs]); // Rerun when notifiedJobs updates

//   // Function to send notifications
//   const sendNotification = (title, body) => {
//     if (Notification.permission === "granted") {
//       new Notification(title, {
//         body,
//         icon: "/logo192.png", // Make sure the icon path is correct
//       });
//       console.log(`Notification sent: ${title}`);
//     }
//   };

//   return (
//     <div>
//       <SideMenu />
//       <div className="container-jobs">
//         {runningJobs.map((job, index) => {
//           const hasError = job.status === "Error";
//           const percentage = job.progress; // Assuming `progress` is part of the API response
//           console.log(job.device_booked_user_end_time + " time");

//           return (
//             <div key={index} className="box-jobs">
//               <div className="box-content-job">
//                 <div className="hub-details-job">
//                   <p className="hub-name-job">Hub Name</p>
//                   <p className="hub-subtext-job">{job.hubname}</p>
//                 </div>
//                 <div className="machine-details-job">
//                   <p className="machine-name-job">Machine Name</p>
//                   <p className="machine-subtext-job">{job.deviceid}</p>
//                 </div>
//                 <div className="Time-job">
//                   <p className="End-Time-job">End Time</p>
//                   <p className="Time-subtext-job">
//                     {new Date(
//                       job.device_booked_user_end_time
//                     ).toLocaleTimeString("en-IN", {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       hour12: true,
//                       timeZone: "Asia/Kolkata", // Ensures IST timezone
//                     })}
//                   </p>
//                 </div>
//               </div>

//               <div className="loader-container-job">
//                 {hasError ? (
//                   <div className="error-circle-job">
//                     <div className="error-message-job">Stopped!</div>
//                   </div>
//                 ) : (
//                   <div className="circular-progress-job">
//                     <svg className="progress-svg-job" viewBox="0 0 100 100">
//                       <circle
//                         className="progress-background-job"
//                         cx="50"
//                         cy="50"
//                         r="45"
//                       />
//                       <circle
//                         className="progress-bar-job"
//                         cx="50"
//                         cy="50"
//                         r="45"
//                         style={{
//                           strokeDashoffset:
//                             282.6 - (282.6 * job.devicestatus) / 100,
//                         }}
//                       />
//                     </svg>
//                     <div className="progress-percentage-job">
//                       {job.devicestatus}%
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default RunningJob;

import React, { useEffect, useState, useRef } from "react";
import "./RunningJob.css";
import SideMenu from "../components/SideMenu";
import axios from "axios";

const RunningJob = () => {
  const [runningJobs, setRunningJobs] = useState([]);
  const [error, setError] = useState(null);
  const notifiedJobs = useRef(new Set()); // Use ref to avoid re-renders

  useEffect(() => {
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
          { usermobile: usernumber, sessiontoken: sessiontoken },
          { headers: { "Content-Type": "application/json" } }
        );

        setRunningJobs(response.data);

        // Check progress for notifications
        response.data.forEach((job) => {
          if (
            job.devicestatus >= 90 &&
            !notifiedJobs.current.has(`${job.deviceid}-90`)
          ) {
            sendNotification(
              "Wash is almost over",
              `Machine ${job.deviceid} is at 90% progress.`
            );
            notifiedJobs.current.add(`${job.deviceid}-90`);
          }

          if (
            job.devicestatus === 100 &&
            !notifiedJobs.current.has(`${job.deviceid}-100`)
          ) {
            sendNotification(
              "Wash Ended",
              `Machine ${job.deviceid} has completed the wash.`
            );
            notifiedJobs.current.add(`${job.deviceid}-100`);
          }
        });
      } catch (err) {
        console.error("Error:", err);
        setError(err.response?.data?.message || "An error occurred.");
      }
    };

    fetchRunningJobs();
    const interval = setInterval(fetchRunningJobs, 5000);

    return () => clearInterval(interval);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          console.warn("Notification permission denied.");
        }
      });
    }
  }, []);

  const sendNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/logo192.png" });
    }
  };

  {
    runningJobs.length === 0 && (
      <h1 style={{ fontSize: "40px", textAlign: "center", color: "black" }}>
        No Running Jobs
      </h1>
    );
  }

  return (
    <div>
      <SideMenu />
      <div className="container-jobs">
        {runningJobs.length === 0 ? (
          <div style={{ width: "70vw",height: "50vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
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
        ) : (
          runningJobs.map((job, index) => {
            const hasError = job.status === "Error";

            return (
              <div key={index} className="box-jobs">
                <div className="box-content-job">
                  <div className="hub-details-job">
                    <p className="hub-name-job">Hub Name</p>
                    <p className="hub-subtext-job">{job?.hubname}</p>
                  </div>
                  <div className="machine-details-job">
                    <p className="machine-name-job">Machine Name</p>
                    <p className="machine-subtext-job">{job?.deviceid}</p>
                  </div>
                  <div className="Time-job">
                    <p className="End-Time-job">End Time</p>
                    <p className="Time-subtext-job">
                      {job?.device_booked_user_end_time
                        ? new Date(
                            job.device_booked_user_end_time
                          ).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            timeZone: "Asia/Kolkata",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="loader-container-job">
                  {hasError ? (
                    <div className="error-circle-job">
                      <div className="error-message-job">Stopped!</div>
                    </div>
                  ) : (
                    <div className="circular-progress-job">
                      <svg className="progress-svg-job" viewBox="0 0 100 100">
                        <circle
                          className="progress-background-job"
                          cx="50"
                          cy="50"
                          r="45"
                        />
                        <circle
                          className="progress-bar-job"
                          cx="50"
                          cy="50"
                          r="45"
                          style={{
                            strokeDashoffset:
                              282.6 - (282.6 * (job?.devicestatus || 0)) / 100,
                          }}
                        />
                      </svg>
                      <div className="progress-percentage-job">
                        {job?.devicestatus || 0}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RunningJob;
