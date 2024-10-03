import React from "react";
import "./Sidebar.css"; // Create a separate CSS file for the sidebar component

function Sidebar({ username }) {
  return (
    <aside className="sidebar">
      <img src="/logo.jpeg" alt="Profile" className="profile-pic" />
      <h1>TechNova Assistant</h1>
      <p>
        I'm a friendly AI here to help you with any queries regarding our
        company.
      </p>
      {/* <button className="signout-button" onClick={handleSignOut}>
        Sign Out
      </button> */}
    </aside>
  );
}

export default Sidebar;
