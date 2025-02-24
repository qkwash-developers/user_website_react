import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import SideMenu from "../components/SideMenu";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");

  // Load user data from session storage on component mount
  useEffect(() => {
    const storedMobile = localStorage.getItem("usermobile");
    const storedUsername = localStorage.getItem("username");
    if (storedMobile) setMobile(storedMobile);
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const toggleEditing = () => {
    if (isEditing) {
      handleSave(); // Save changes when exiting edit mode
    }
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    try {
      const sessionToken = localStorage.getItem("qkwashtoken");
      if (!sessionToken) {
        alert("Session token is missing. Please log in again.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/settings/userProfile`,
        {
          username: username,
          mobile: mobile,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`, // Pass session token in Authorization header
          },
        }
      );

      if (response.data.success) {
        alert("Profile updated successfully!");
        localStorage.setItem("username", username); // Update session storage with new username
      } else {
        alert(
          response.data.message || "Failed to update profile. Please try again."
        );
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <div>
      <SideMenu />
      <div className="profile-editor">
        <div className="profile-picture-container">
          <div className="profile-picture">
            <img
              src="https://static.vecteezy.com/system/resources/previews/027/245/516/non_2x/male-3d-avatar-free-png.png"
              alt="Profile"
            />
          </div>
        </div>

        <div className="profile-details">
          <p className="profile-name">
            Name:{" "}
            <span>
              {isEditing ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              ) : (
                username
              )}
            </span>
          </p>
          <p className="profile-info">
            Mobile Number:{" "}
            <span>
              {isEditing ? (
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              ) : (
                mobile
              )}
            </span>
          </p>
          <p className="profile-info">
            Hub Name: <span>Kochi</span> {/* Hub Name remains static */}
          </p>
        </div>

        <button className="edit-button" onClick={toggleEditing}>
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
