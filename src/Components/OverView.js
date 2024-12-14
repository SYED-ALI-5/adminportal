import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import auth_bg from "../Assets/Owner_Auth_Bg.png";

export default function Dashboard() {
  const location = useLocation();
  const [overviewData, setOverviewData] = useState({
    totalUsers: 0,
    totalGrounds: 0,
    totalBookings: 0,
    lastMonthRevenue: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const excludedPaths = [
    "/notifications",
    "/viewprofile",
    "/addground",
    "/removeground",
    "/editground",
    "/editspecificground",
    "/ground",
    "/bookinghistory",
    "/usermanagement",
    "/message/:id",
    "/help",
  ];

  const isExcludedPath = excludedPaths.some((path) => {
    if (path.includes(":id")) {
      const regex = new RegExp(`^${path.replace(":id", "\\d+")}$`);
      return regex.test(location.pathname);
    }
    return location.pathname === path;
  });

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const response = await fetch("http://localhost:5000/overview");
        if (!response.ok) {
          throw new Error("Failed to fetch overview data");
        }
        const data = await response.json();
        setOverviewData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${auth_bg})`,
        }}
      >
        {!isExcludedPath && (
          <div className="container my-5 d-flex flex-column align-items-center justify-content-center">
            <h2 style={{ color: "rgb(105 255 224)" }}>Admin Dashboard</h2>
            <div
              style={{
                width: "50%",
                border: "2px solid rgb(105 255 224)",
                borderRadius: "35px",
                color: "white",
              }}
              className="d-flex flex-column align-items-center justify-content-center my-5"
            >
              <div className="revenue-data">
                <div
                  style={{ borderBottom: "3px dashed rgb(105 255 224)" }}
                  className="revenue-data-specific"
                >
                  <span style={{ color: "white" }} className="py-2">
                    <b>Total No. of Registered Users:</b>
                    <strong> {overviewData.totalUsers}</strong>
                  </span>
                </div>
                <div
                  style={{ borderBottom: "3px dashed rgb(105 255 224)" }}
                  className="revenue-data-specific"
                >
                  <span style={{ color: "white" }} className="py-2">
                    <b>Total No. of Registered Grounds:</b>
                    <strong> {overviewData.totalGrounds}</strong>
                  </span>
                </div>
                <div
                  style={{ borderBottom: "3px dashed rgb(105 255 224)" }}
                  className="revenue-data-specific"
                >
                  <span style={{ color: "white" }} className="py-2">
                    <b>Total No. of Bookings Through Platform: </b>
                    <strong> {overviewData.totalBookings}</strong>
                  </span>
                </div>
                <div
                  style={{ borderBottom: "3px dashed rgb(105 255 224)" }}
                  className="revenue-data-specific"
                >
                  <span style={{ color: "white" }} className="py-2">
                    <b>Last Month Revenue Generated Through Platform: Rs.</b>
                    <strong> {overviewData.lastMonthRevenue}</strong>
                  </span>
                </div>
                <div className="revenue-data-specific">
                  <span style={{ color: "white" }} className="py-2">
                    <b>Total Revenue Generated Through Platform: Rs.</b>
                    <strong> {overviewData.totalRevenue}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
