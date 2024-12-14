import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function NotificationDetail() {
  const { id } = useParams(); // Get the notification ID from the URL
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await fetch(`/api/notifications/${id}`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Notification not found");
        }
        const data = await response.json();
        setNotification(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [id]);

  if (loading) {
    return <div className="container my-5">Loading notification...</div>;
  }

  if (error) {
    return (
      <div className="container my-5">
        <h3>{error}</h3>
        <Link to="/notifications" className="btn btn-primary mt-3">
          Back to Notifications
        </Link>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="container my-5">
        <h3>Notification not found</h3>
        <Link to="/notifications" className="btn btn-primary mt-3">
          Back to Notifications
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2>{notification.subject}</h2>
      <p className="text-muted">{notification.time}</p>
      <p>{notification.body}</p>
      <Link to="/notifications" className="btn btn-primary mt-3">
        Back to Notifications
      </Link>
    </div>
  );
}
