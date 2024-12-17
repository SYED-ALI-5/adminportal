// Done

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaMinus } from "react-icons/fa";
import axios from "axios";

export default function RemoveGround() {
  const navigate = useNavigate();
  const [grounds, setGrounds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("/api/grounds")
      .then((response) => setGrounds(response.data))
      .catch((error) => console.error("Error fetching grounds:", error));
  }, []);

  const filteredGrounds = grounds.filter(
    (ground) =>
      ground.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ground.addres?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGroundClick = (ground) => {
    if (!ground.id) {
      console.error("Ground ID is missing.");
      alert("Unable to navigate. Ground ID is missing.");
      return;
    }
    navigate(`/ground/${ground.id}`);
  };

  const handleDelete = (id) => {
    const record = grounds.find((ground) => ground.id === id);
    if (!record) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this record?\n\nName: ${record.name}\nLocation: ${record.addres}`
    );

    if (confirmDelete) {
      axios
        .delete(`/api/grounds/${id}`)
        .then(() => {
          const updatedGrounds = grounds.filter((ground) => ground.id !== id);
          setGrounds(updatedGrounds);
          alert("Ground deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting ground:", error);
          alert("Failed to delete the ground.");
        });
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center my-5">
      <h1 style={{ color: "rgb(57 171 148)" }} className="text-center mb-5">
        Remove Ground
      </h1>

      <input
        type="text"
        placeholder="Search by name or location"
        className="form-control mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredGrounds.map((ground) => (
        <div
          key={ground.id}
          className="ground-data my-3 px-5 py-3 w-100 d-flex flex-row justify-content-between align-items-center"
        >
          <div className="d-flex flex-row justify-content-start">
            <img
              src={ground.photo?.[0] || "placeholder.jpg"}
              className="image-ground-selection"
              alt="Ground Photo"
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
              <div className="loc d-flex align-items-center">
                <p className="mb-0">{ground.addres}</p>
                <FaMapMarkerAlt className="icon ms-2" />
              </div>
            </div>
          </div>
          <button
            onClick={() => handleDelete(ground.id)}
            type="button"
            className="btn btn-danger d-flex flex-row justify-content-between align-items-center my-1"
          >
            Delete Ground &nbsp;&nbsp;
            <FaMinus />
          </button>
        </div>
      ))}
    </div>
  );
}
