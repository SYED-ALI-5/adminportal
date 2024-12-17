import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaEye, FaMapMarkerAlt } from "react-icons/fa";
import std_icon from "../Assets/sign_Bg.jpeg";

export default function ViewProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.user;

  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.username) {
      fetchGroundsAndPhotos(userData.username);
    } else {
      setLoading(false); // If not a ground owner, no need to fetch
    }
  }, [userData]);

  const fetchGroundsAndPhotos = async (username) => {
    try {
      // Fetch grounds registered to the ground owner
      const groundsResponse = await fetch(`/api/grounds?owner=${username}`);
      const groundsData = await groundsResponse.json();

      // Fetch all photos for each ground
      const enrichedGrounds = await Promise.all(
        groundsData.map(async (ground) => {
          const photoResponse = await fetch(
            `/api/photos?groundId=${ground.id}`
          );
          const photos = await photoResponse.json();

          return {
            ...ground,
            photos: photos.map((photo) => photo.base64), // Array of all photos in Base64
          };
        })
      );

      setGrounds(enrichedGrounds);
    } catch (error) {
      console.error("Error fetching grounds or photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroundClick = (ground) => {
    // Pass the selected ground data, including all photos, to Ground.js
    navigate("/ground", { state: { ground } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container p-4 align-items-center">
      <h1 className="text-center mb-5" style={{ color: "rgb(57 171 148)" }}>
        Account Details
      </h1>
      <div className="email">
        <img
          src={userData?.photo || std_icon}
          alt="User"
          className="mb-3"
          style={{
            width: "150px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      </div>
      <div className="infor-details">
        <div className="d-flex flex-column">
          <div className="mb-3">
            <h5 className="label">
              <b>Name:</b>
            </h5>
            <span className="view-profile-span">{userData?.name || "N/A"}</span>
          </div>
          {userData?.username && (
            <div className="mb-3">
              <h5 className="label">
                <b>Username:</b>
              </h5>
              <span className="view-profile-span">{userData.username}</span>
            </div>
          )}
          {userData?.phone && (
            <div className="mb-3">
              <h5 className="label">
                <b>Phone Number:</b>
              </h5>
              <span className="view-profile-span">{userData.phone}</span>
            </div>
          )}
          <div className="mb-3">
            <h5 className="label">
              <b>Email address:</b>
            </h5>
            <span className="view-profile-span">
              {userData?.email || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Ground Details Section */}
      {userData?.username && (
        <div className="d-flex flex-column justify-content-center align-items-center">
          {grounds.map((ground) => (
            <div
              key={ground.id}
              className="ground-data my-3 px-4 py-3 d-flex flex-row justify-content-center align-items-center"
            >
              <img
                src={ground.photos[0] || std_icon} // Use the first photo or fallback
                className="image-ground-selection"
                alt={`Ground ${ground.id}`}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <div className="d-flex flex-column justify-content-center align-items-start px-5">
                <div className="signup text-center">
                  <Link
                    to="/ground"
                    className="btn-ground"
                    onClick={() => handleGroundClick(ground)}
                  >
                    <b>{ground.name || "Ground Name"}</b>
                  </Link>
                </div>
                <div className="loc">
                  <p>{ground.location || "Ground Location"}</p>
                  <FaMapMarkerAlt className="icon ms-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex flex-row justify-content-center align-items-center my-4">
        <button
          onClick={() =>
            navigate("/bookinghistory", {
              state: {
                id: userData?.id, // Pass user id
                type: userData?.isGroundOwner ? "groundOwner" : "customer", // Determine user type
              },
            })
          }
          type="button"
          className="btn btn-success d-flex flex-row justify-content-between align-items-center my-1 text-center"
        >
          View Booking
          History&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <FaEye />
        </button>
      </div>
    </div>
  );
}
