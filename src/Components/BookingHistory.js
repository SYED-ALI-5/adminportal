import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import auth_bg from "../Assets/Owner_Auth_Bg.png";

export default function BookingHistory() {
  const location = useLocation();
  const { id, type } = location.state; // Extract user info passed from ViewProfile

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const response = await fetch(
          `/api/booking-history?id=${id}&type=${type}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch booking history");
        }

        const bookings = await response.json();
        setData(bookings);
      } catch (error) {
        console.error("Error fetching booking history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [id, type]);

  if (loading) {
    return <div className="text-center my-5">Loading booking history...</div>;
  }

  return (
    <div style={{ backgroundImage: `url(${auth_bg})` }}>
      <h2 style={{ color: "rgb(57 171 148)" }} className="py-5 text-center">
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
                    <b>
                      {type === "groundOwner"
                        ? "Customer Name"
                        : "Ground Owner Name"}
                      :&nbsp;&nbsp;
                    </b>
                    {item.customer_name || item.owner_name}
                  </span>
                </div>
                <div>
                  <span>
                    <b>Email:&nbsp;&nbsp;</b>
                    {item.email}
                  </span>
                </div>
                <div>
                  <span>
                    <b>Phone Number:&nbsp;&nbsp;</b>
                    {item.phone}
                  </span>
                </div>
                <div>
                  <span>
                    <b>Booking Time:&nbsp;&nbsp;</b>
                    {item.time}
                  </span>
                </div>
                <div>
                  <span>
                    <b>Booking Date:&nbsp;&nbsp;</b>
                    {item.date}
                  </span>
                </div>
                {!type === "groundOwner" && item.stadium && (
                  <div>
                    <span>
                      <b>Stadium Name:&nbsp;&nbsp;</b>
                      {item.stadium}
                    </span>
                  </div>
                )}
                {!type === "groundOwner" && item.location && (
                  <div>
                    <span>
                      <b>Location:&nbsp;&nbsp;</b>
                      {item.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No booking history found.</div>
        )}
      </div>
    </div>
  );
}
