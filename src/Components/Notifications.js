import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch notifications from the backend API
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/notifications");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch("http://localhost:5000/notifications/markAllRead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }
      // Re-fetch notifications to get the updated status
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Mark a single notification as read
  const handleNotificationClick = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/notifications/${id}/markRead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
      // Re-fetch notifications to get the updated status
      fetchNotifications();

      // Navigate to a detailed view
      const selectedNotification = notifications.find((n) => n.id === id);
      navigate(`/message/${id}`, { state: { notification: selectedNotification } });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  if (loading) {
    return <div className="container my-5">Loading notifications...</div>;
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Notifications</h2>
        <button
          className="btn btn-primary"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark All as Read
        </button>
      </div>
      <div className="card shadow-sm">
        <div className="card-header d-flex align-items-center">
          <i
            className="fa-solid fa-bell me-2"
            style={{ fontSize: "24px", color: "#0d6efd" }}
          ></i>
          <h5 className="mb-0">
            Notifications{" "}
            {unreadCount > 0 && (
              <span className="badge bg-danger ms-2">{unreadCount}</span>
            )}
          </h5>
        </div>
        <ul className="list-group list-group-flush">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li
                key={notification.id}
                className={`list-group-item ${
                  notification.read ? "bg-light" : ""
                }`}
                onClick={() => handleNotificationClick(notification.id)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <h6 className={notification.read ? "" : "fw-bold"}>
                    {notification.subject}
                  </h6>
                  <small className="text-muted">{notification.time}</small>
                </div>
              </li>
            ))
          ) : (
            <li className="list-group-item text-center">No notifications</li>
          )}
        </ul>
      </div>
    </div>
  );
}