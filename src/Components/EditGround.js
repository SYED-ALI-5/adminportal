// Done

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";

export default function EditGround() {
  const navigate = useNavigate();
  const [groundData, setGroundData] = useState([]);
  const [groundImages, setGroundImages] = useState({}); // Store Base64 images for each ground
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data from the database
  useEffect(() => {
    axios
      .get("/api/grounds") // API to fetch ground data
      .then((response) => {
        setGroundData(response.data);
        // Fetch images for all grounds
        response.data.forEach((ground) => {
          axios
            .get(`/api/groundimages?groundId=${ground.id}`) // API to fetch Base64 images for each ground
            .then((imageResponse) => {
              setGroundImages((prevState) => ({
                ...prevState,
                [ground.id]: imageResponse.data, // Map ground ID to its Base64 images
              }));
            })
            .catch((error) =>
              console.error(
                `Error fetching images for ground ${ground.id}:`,
                error
              )
            );
        });
      })
      .catch((error) => console.error("Error fetching grounds:", error));
  }, []);

  // Filter logic for search
  const filteredGrounds = groundData.filter(
    (ground) =>
      ground.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ground.addres.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigate to EditSpecificGround with data
  const handleGroundClick = (ground) => {
    navigate(`/editspecificground/${ground.id}`); // Pass ground ID in the URL
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center my-5">
      <h1 style={{ color: "rgb(57 171 148)" }} className="text-center mb-5">
        Edit Ground
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or location"
        className="form-control mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Render filtered grounds */}
      {filteredGrounds.map((ground) => (
        <div
          key={ground.id}
          className="ground-data my-3 px-5 py-3 w-50 d-flex flex-row justify-content-start align-items-center"
        >
          <img
            src={`data:image/jpeg;base64,${groundImages[ground.id]?.[0] || ""}`} // Use Base64 image
            className="image-ground-selection"
            alt="Ground"
          />
          <div className="d-flex flex-column justify-content-center align-items-start px-5">
            <div className="signup text-center">
              <button
                className="btn btn-link p-0 text-decoration-none text-black btn-ground"
                onClick={() => handleGroundClick(ground)}
              >
                <b>{ground.name}</b>
              </button>
            </div>
            <div className="loc">
              <p>{ground.addres}</p>
              <FaMapMarkerAlt className="icon ms-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}