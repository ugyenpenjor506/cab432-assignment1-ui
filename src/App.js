import React, { useState } from "react";
import "./App.css";
import Home from "./home/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./auth/Login";
import Register from "./auth/Register";

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
    
export default App;
