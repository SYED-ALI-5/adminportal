import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // For showing a loading state
  const navigate = useNavigate();

  // Fetch notifications from the backend API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/http://localhost:5000/notifications"); // Replace with your API endpoint
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

    fetchNotifications();
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    // Optionally, send a request to update all notifications as read in the backend
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const handleNotificationClick = (id) => {
    const selectedNotification = notifications.find(
      (notification) => notification.id === id
    );

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );

    // Navigate to a detailed view
    navigate(`/message/${id}`, { state: { notification: selectedNotification } });
  };

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
