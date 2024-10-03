import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Named export for jwtDecode

import "./Header.css"; 

function Header({ token }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false); // Control the menu visibility
  const [showUploadModal, setShowUploadModal] = useState(false); // Control the upload modal visibility
  const [selectedFile, setSelectedFile] = useState(null); // Handle file input
  const [uploadMessage, setUploadMessage] = useState(""); // Message after upload
  const [profilePicUrl, setProfilePicUrl] = useState(null); // Handle profile picture
  const [fullname, setFullname] = useState(""); // Store the full name from the token

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token); // Decode the token
      const userFullName = decodedToken.name || decodedToken.fullname; // Extract the full name
      setFullname(userFullName); // Set the full name in the state
      fetchProfilePicture(token); // Fetch the profile picture when the component mounts
    }
  }, [token]);

  // Function to fetch the profile picture URL
  const fetchProfilePicture = async (token) => {
    try {
      const response = await fetch('http://localhost:5005/download-profile-picture', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.url) {
        setProfilePicUrl(data.url); // Set the retrieved URL to display the profile picture
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const handleReview = () => {
    navigate("/review");
  };

  // Helper function to get initials of the full name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_pic", selectedFile);

    try {
      const response = await fetch("http://localhost:5005/upload-profile-picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Add the Authorization token in the headers
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploadMessage("Profile picture uploaded successfully!");
        fetchProfilePicture(token); // Fetch the updated profile picture after upload
        setShowUploadModal(false); // Close the modal after successful upload
      } else {
        setUploadMessage(data.message || "Failed to upload profile picture.");
      }
    } catch (error) {
      setUploadMessage("An error occurred while uploading the profile picture.");
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="chat-header">
      <h3>Hi {fullname}</h3> {/* Use the full name here */}
      <div
        className="header-avatar"
        onClick={toggleMenu} // Open menu on avatar click
        style={{
          backgroundColor: "#666",
          color: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          cursor: "pointer",
          backgroundImage: profilePicUrl
            ? `url(${profilePicUrl})`
            : "none",
          backgroundSize: "cover",
        }}
      >
        {!profilePicUrl && <span>{getInitials(fullname)}</span>} {/* Use the full name for initials */}
      </div>

      {/* Menu for options */}
      {showMenu && (
        <div className="menu">
          <ul>
            <li onClick={() => { setShowUploadModal(true); setShowMenu(false); }}>Upload Profile Picture</li>
            <li onClick={handleReview}>Review</li>
            <li onClick={handleSignOut}>Sign Out</li>
          </ul>
        </div>
      )}

      {/* Modal for file upload */}
      {showUploadModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Upload Profile Picture</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <button onClick={() => setShowUploadModal(false)}>Cancel</button>
            {uploadMessage && <p>{uploadMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
