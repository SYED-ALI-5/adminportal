import React, { useState, useEffect } from "react";
import { FaMinus, FaEye } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function UserManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the type of data to show based on the URL state
  const isGroundOwner = location.state?.type === "groundOwner";

  const [data, setData] = useState([]); // State for fetched data
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Fetch data from the backend on mount or when `isGroundOwner` changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          isGroundOwner
            ? "http://localhost:5000/api/groundowners" // Replace with your backend endpoint
            : "http://localhost:5000/api/customers" // Replace with your backend endpoint
        );
        const result = await response.json();
        setData(result);
        setFilteredData(result); // Set filtered data initially
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isGroundOwner]);

  // Filter data based on the search query
  useEffect(() => {
    const results = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.phone && item.phone.includes(searchQuery))
    );
    setFilteredData(results);
  }, [searchQuery, data]);

  const handleViewProfile = (id) => {
    const selectedUser = data.find((item) => item.id === id);
    navigate("/viewprofile", { state: { user: selectedUser } });
  };

  const handleDelete = async (id) => {
    const record = data.find((item) => item.id === id);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this record?\n\nName: ${record.name}\nEmail: ${record.email}\nPhone: ${record.phone}`
    );

    if (confirmDelete) {
      try {
        await fetch(`http://localhost:5000/api/users/${id}`, {
          method: "DELETE",
        });
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        setFilteredData(updatedData); // Update filtered data
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center my-4">
      <h3 style={{ color: "#55ad9b" }}>
        {isGroundOwner ? "Ground Owner Details" : "Customer User Details"}
      </h3>

      {/* Search Bar */}
      <form
        className="d-flex my-3"
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search by Name, Email, or Phone"
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>

      {/* List of Users/Ground Owners */}
      {filteredData.map((item) => (
        <div
          key={item.id}
          style={{ border: "2px solid #55ad9b", borderRadius: "10px" }}
          className="user-action-log d-flex flex-row justify-content-between align-items-center w-100 p-2 my-2"
        >
          <div className="user-details d-flex align-items-center">
            {/* Display photo only for ground owners */}
            {isGroundOwner && item.photo && (
              <img
                src={item.photo}
                alt="Ground Owner"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  marginRight: "20px",
                  objectFit: "cover",
                  border: "2px solid #55ad9b",
                }}
              />
            )}
            <div>
              <div className="user-specific">
                <span className="py-2">
                  <b>Name:&nbsp;&nbsp;&nbsp;</b>
                  {item.name}
                </span>
              </div>
              {isGroundOwner && (
                <div className="user-specific">
                  <span className="py-2">
                    <b>Username:&nbsp;&nbsp;&nbsp;&nbsp;</b>
                    {item.username}
                  </span>
                </div>
              )}
              <div className="user-specific">
                <span className="py-2">
                  <b>Email:&nbsp;&nbsp;&nbsp;&nbsp;</b>
                  {item.email}
                </span>
              </div>
              {isGroundOwner && (
                <div className="user-specific">
                  <span className="py-2">
                    <b>Phone Number:&nbsp;&nbsp;&nbsp;</b>
                    {item.phone}
                  </span>
                </div>
              )}
              <div>
                <span style={{ color: "red" }}>
                  <b>Total Bookings Made: </b>
                  {item.bookings}
                </span>
              </div>
            </div>
          </div>
          <div className="user-buttons">
            <button
              onClick={() => handleViewProfile(item.id)}
              type="button"
              className="btn btn-primary d-flex flex-row justify-content-between align-items-center my-1"
            >
              View Profile&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <FaEye />
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              type="button"
              className="btn btn-danger d-flex flex-row justify-content-between align-items-center my-1"
            >
              Delete Account &nbsp;&nbsp; <FaMinus />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
