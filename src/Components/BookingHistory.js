import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import auth_bg from "../Assets/Owner_Auth_Bg.png";

export default function BookingHistory() {
  const location = useLocation();

  // Determine the type of data to show based on the URL state
  const isGroundOwner = location.state?.type === "groundOwner";

  // State to hold booking data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch booking data dynamically
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true
        const response = await fetch(
          isGroundOwner
            ? "/api/ground-owner/bookings" // Endpoint for ground owner
            : "/api/customer/bookings" // Endpoint for customer
        );
        if (!response.ok) {
          throw new Error("Failed to fetch booking data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchData();
  }, [isGroundOwner]);

  if (loading) {
    return <p style={{ color: "white", textAlign: "center" }}>Loading...</p>;
  }

  if (error) {
    return (
      <p style={{ color: "red", textAlign: "center" }}>
        Error: {error}. Please try again later.
      </p>
    );
  }

  return (
    <div
      style={{
        backgroundImage: `url(${auth_bg})`,
      }}
    >
      <h2 style={{ color: "rgb(57 171 148)" }} className="py-5 text-center">
        Booking History
      </h2>
      <div className="container d-flex flex-column align-items-center justify-content-center pb-5">
        {data.map((item) => (
          <div
            key={item.id}
            style={{ border: "2px solid #55ad9b", borderRadius: "10px", color: "white" }}
            className="d-flex justify-content-center align-items-start my-2 py-2 px-5"
          >
            <div className="user-details">
              <div className="user-specific">
                <span className="py-2">
                  <b>
                    {isGroundOwner ? "Ground Owner Name" : "Customer Name"}
                    :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </b>
                  {item.name}
                </span>
              </div>
              <div className="user-specific">
                <span className="py-2">
                  <b>Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                  {item.email}
                </span>
              </div>
              <div>
                <span>
                  <b>Booking Time:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                  {item.time}
                </span>
              </div>
              <div>
                <span>
                  <b>Booking Date:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                  {item.date}
                </span>
              </div>
              <div className="user-specific">
                <span>
                  <b>Phone Number:&nbsp;&nbsp;</b>
                  {item.phone}
                </span>
              </div>
              {!isGroundOwner && item.stadium && (
                <div>
                  <span>
                    <b>
                      Stadium Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </b>
                    {item.stadium}
                  </span>
                </div>
              )}
              {!isGroundOwner && item.location && (
                <div>
                  <span>
                    <b>Location:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                    {item.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
