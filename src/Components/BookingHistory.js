// Done

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import auth_bg from "../Assets/Owner_Auth_Bg.png";

export default function BookingHistory() {
  const location = useLocation();
  const { id, type, email, groundId } = location.state || {}; // Retrieve user data from state
  const isGroundOwner = type === "groundOwner";

  // Error handling for missing required data
  if (!type || (!email && !groundId)) {
    return <div>Error: Missing required data for booking history.</div>;
  }

  // State to hold booking data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        // Determine the query parameter based on the user type
        const queryParam = isGroundOwner
          ? `groundId=${groundId}`
          : `email=${email}`;

        // Fetch booking history from the server for the specific user
        const response = await fetch(`/api/bookings?${queryParam}`);
        const bookings = await response.json();
        setData(bookings);
      } catch (error) {
        console.error("Error fetching booking history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isGroundOwner ? groundId : email) {
      fetchBookingHistory();
    } else {
      setLoading(false); // No ID or email, no data to fetch
    }
  }, [email, groundId, isGroundOwner]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        backgroundImage: `url(${auth_bg})`,
      }}
    >
      <h1 style={{ color: "rgb(57 171 148)" }} className="pt-5 text-center">
        {isGroundOwner ? "Ground Owner" : "Customer"}
      </h1>
      <h2
        style={{ color: "rgb(57 171 148)" }}
        className="pt-3 pb-5 text-center"
      >
        Booking History
      </h2>
      <div className="container d-flex flex-column align-items-center justify-content-center pb-5">
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              style={{
                border: "2px solid #55ad9b",
                borderRadius: "10px",
                color: "white",
              }}
              className="d-flex justify-content-center align-items-start my-2 py-2 px-5"
            >
              <div className="user-details">
                <div className="user-specific">
                  <span className="py-2">
                    <b>Ground Owner Name :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                    {item.ownerName}
                  </span>
                </div>
                <div className="user-specific">
                  <span>
                    <b>Owner Phone Number:&nbsp;&nbsp;</b>
                    {item.ownerPhone}
                  </span>
                </div>
                <div className="user-specific">
                  <span className="py-2">
                    <b>Customer Name :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                    {item.customerName}
                  </span>
                </div>
                <div className="user-specific">
                  <span>
                    <b>Customer Phone Number:&nbsp;&nbsp;</b>
                    {item.customerPhone}
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
                <div>
                  <span>
                    <b>Payment Status:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: "white" }}>No booking history available.</div>
        )}
      </div>
    </div>
  );
}