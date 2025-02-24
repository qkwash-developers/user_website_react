import React, { useState } from "react";
import SideMenu from "../components/SideMenu";
import "./Notification.css";
import { FaBell } from "react-icons/fa";
const Notification = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, date: "12/24", message: "New message received" },
    { id: 2, date: "11/24", message: "New Reward " },
  ]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);

  const addNotification = () => {
    const newNotification = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        year: "2-digit",
      }),
      message: "This is a new notification",
    };
    setNotifications([newNotification, ...notifications]);
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const closePopup = () => {
    setPopupMessage(null);
  };

  return (
    <div>
      <SideMenu />

      <div className="notification-box">
        <div className="header">
          <div className="header-left">
            <FaBell className="notification-icon" />

            <span className="header-text">Notifications</span>
          </div>

          <div className="menu">
            <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
              ...
            </div>
            {menuOpen && (
              <div className="menu-dropdown">
                <div className="menu-item" onClick={clearNotifications}>
                  <span>🗑</span> Delete All
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="table">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="row"
                onClick={() => setPopupMessage(notification.message)}
              >
                <div className="date">{notification.date}</div>
                <div className="message">{notification.message}</div>
                <div
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  🗑
                </div>
              </div>
            ))
          ) : (
            <div className="no-notifications">No Notifications</div>
          )}
        </div>
        {popupMessage && (
          <div className="popup-overlay-notification" onClick={closePopup}>
            <div
              className="popup-box-notification"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popup-content-notification">{popupMessage}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
