import React, { useState, useEffect } from "react";
import axios from "axios";
import "./History.css";
import SideMenu from "../components/SideMenu";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch usermobile and sessiontoken from localStorage
    const usermobile = localStorage.getItem("usermobile");
    const sessiontoken = localStorage.getItem("qkwashtoken");

    if (!usermobile || !sessiontoken) {
      setError("Missing user information. Please log in again.");
      setLoading(false);
      return;
    }

    // Define the function to fetch history data
    const fetchHistory = async () => {
      const requestBody = {
        usermobile,
        sessiontoken,
      };

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/history/`,
          requestBody
        );
        console.log(response.data);
        setHistoryData(response.data); // Save API data to state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error);
        setError("Failed to load history. Please try again later.");
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <SideMenu />
      <div className="table-container-history">
        <h1 className="page-title">Wash History</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Hub Name</th>
                <th>Device ID</th>
                <th>Device Type</th>
                <th>End Time</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((row, index) => {
                console.log(
                  "device_booked_user_end_time:",
                  row.device_booked_user_end_time
                );
                return (
                  <tr key={index}>
                    <td>{row.hubname}</td>
                    <td>{row.deviceid}</td>
                    <td>{row.devicetype}</td>
                    <td>
                      {new Date(
                        row.device_booked_user_end_time
                      )?.toLocaleString()}
                    </td>
                    <td>{row.booked_user_amount || "nil"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default History;
