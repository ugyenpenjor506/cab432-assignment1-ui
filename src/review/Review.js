import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Import arrow icon
import Sidebar from "../sidebar/Sidebar";
import "./Review.css";

function Review() {
  const [username, setUsername] = useState("");
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]); // Add state to store users list
  const [review, setReview] = useState(""); // Add state for review text
  const [rating, setRating] = useState(0); // Add state for rating
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal open/close
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const usernameFromUrl = params.get("username");

    const storedUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (tokenFromUrl && usernameFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      localStorage.setItem("username", usernameFromUrl);
      setUsername(usernameFromUrl);
    } else if (storedUsername && token) {
      setUsername(storedUsername);
    } else {
      navigate("/");
    }

    // Fetch reviews and users from API
    fetchFeedback();
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/get_all_users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users); // Store users in state
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchFeedback = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/get-all-feedback`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const feedbackData = data.feedback.map((item) => ({
          userId: item.UserID,
          review: item.Comments,
          rating: parseInt(item.Rating),
          timestamp: new Date(item.Timestamp).toLocaleString(), // Format timestamp
        }));

        setReviews(feedbackData);
      } else {
        console.error("Failed to fetch feedback");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  // Helper function to find full name by userId
  const getFullName = (userId) => {
    const user = users.find((u) => u.user_id === userId);
    return user ? user.full_name : "Unknown User";
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem("token");

    // Prepare the review data to send to the API
    const reviewData = {
      Rating: rating,
      Comments: review,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/submit-feedback`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        // If the review submission was successful, refresh the feedback list
        fetchFeedback();
        setIsModalOpen(false); // Close the modal after submission
        setReview(""); // Reset the review text
        setRating(0); // Reset the rating
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const calculateAverageRating = () => {
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    return reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
  };

  return (
    <div className="App">
      <Sidebar username={username} />
      <main className="review-container">
        {/* Back button on top right */}
        <div className="back-button-container">
          <FaArrowLeft className="back-button" onClick={() => navigate(-1)} />
        </div>

        <div>
          <h2>User Reviews</h2>

          {/* Display average rating */}
          <div className="average-rating">
            <strong>Average Rating: </strong>
            {reviews.length > 0
              ? `${calculateAverageRating()} / 5`
              : "No reviews yet"}
          </div>

          {/* Display all reviews */}
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((r, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <strong>{getFullName(r.userId)}</strong> {/* Display full name */}
                    <span className="rating-stars">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </span>
                  </div>
                  <div className="review-text">{r.review}</div>
                  <div className="review-timestamp">{r.timestamp}</div>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to write one!</p>
            )}
          </div>

          {/* Button to open the review modal */}
          <button onClick={() => setIsModalOpen(true)}>Write a Review</button>

          {/* Modal for submitting a review */}
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={() => setIsModalOpen(false)}>
                  &times;
                </span>
                <h2>Submit Your Review</h2>
                <div className="review-form">
                  <textarea
                    placeholder="Write your review..."
                    value={review} // Controlled textarea
                    onChange={(e) => setReview(e.target.value)} // Update state
                    rows="4"
                  />
                  <div className="rating-select">
                    <strong>Select Rating: </strong>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <span
                          key={num}
                          className={num <= rating ? "star filled" : "star"} // Handle rating selection
                          onClick={() => setRating(num)} // Update rating state
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleSubmitReview}>Submit Review</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Review;
