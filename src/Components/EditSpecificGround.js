import React, { useState, useEffect } from "react";
import Map from "./Map"; // Ensure Map component accepts lat/lng props
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EditSpecificGround() {
  const { id } = useParams(); // Get ground ID from URL
  const [formData, setFormData] = useState(null); // State for ground data

  // Fetch ground data from the database
  useEffect(() => {
    axios
      .get(`/api/grounds/${id}`) // Fetch ground by ID
      .then((response) => {
        setFormData({
          ...response.data,
          dynamicFields: response.data.dynamicFields || {
            pitchTypes: [],
            stadiumFacilities: [],
            equipmentProvided: [],
          },
        });
      })
      .catch((error) => console.error("Error fetching ground:", error));
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle dynamic field changes
  const handleDynamicFieldChange = (e, field, index) => {
    const updatedFields = [...formData.dynamicFields[field]];
    updatedFields[index] = e.target.value;
    setFormData({
      ...formData,
      dynamicFields: { ...formData.dynamicFields, [field]: updatedFields },
    });
  };

  // Add dynamic field
  const addDynamicField = (field) => {
    setFormData({
      ...formData,
      dynamicFields: {
        ...formData.dynamicFields,
        [field]: [...formData.dynamicFields[field], ""],
      },
    });
  };

  // Handle image uploads
  const handleImageUpload = (e, index) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos[index] = e.target.files[0];
    setFormData({ ...formData, photos: updatedPhotos });
  };

  // Add new image field
  const addImageField = () => {
    setFormData({ ...formData, photos: [...formData.photos, null] });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      photos: formData.photos.filter((photo) => typeof photo !== "object"), // Exclude files for now
    };

    axios
      .put(`/api/grounds/${id}`, updatedData) // Update ground details
      .then(() => alert("Ground updated successfully!"))
      .catch((error) => console.error("Error updating ground:", error));
  };

  // If data is still loading
  if (!formData) return <p>Loading...</p>;

  return (
    <div className="container my-5">
      <h1 style={{ color: "rgb(57 171 148)" }} className="text-center">
        Edit Ground
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Ground Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Ground Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <label htmlFor="phone" className="form-label text-black">
            Owner Phone Number
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label text-black">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="addres" className="form-label text-black">
            Addes
          </label>
          <input
            type="text"
            className="form-control"
            id="addres"
            name="addres"
            value={formData.addres}
            onChange={handleInputChange}
          />
        </div>

        {/* Pitch Types */}
        <div className="d-flex flex-column">
          <label className="form-label text-black">Pitch Types</label>

          {/* Render existing input fields */}
          {formData.dynamicFields.pitchTypes.map((value, index) => (
            <div key={index} className="d-flex mb-2">
              <input
                type="text"
                className="form-control me-2"
                value={formData.dynamicFields.pitchTypes[index]}
                onChange={(e) =>
                  handleDynamicFieldChange(e, "pitchTypes", index)
                }
              />
            </div>
          ))}
        </div>
        {/* Add button */}
        <button
          type="button"
          className="mb-3 btn btn-primary"
          onClick={() => addDynamicField("pitchTypes")}
        >
          + Add
        </button>

        {/* Stadium Facilities */}
        <div className="d-flex flex-column">
          <label className="form-label text-black">Stadium Facilities</label>

          {formData.dynamicFields.stadiumFacilities.map((value, index) => (
            <div key={index} className="d-flex mb-2">
              <input
                type="text"
                className="form-control me-2"
                value={formData.dynamicFields.stadiumFacilities[index]}
                onChange={(e) =>
                  handleDynamicFieldChange(e, "stadiumFacilities", index)
                }
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mb-3 btn btn-primary"
          onClick={() => addDynamicField("stadiumFacilities")}
        >
          + Add
        </button>

        {/* Equipment Provided */}
        <div className="d-flex flex-column">
          <label className="form-label text-black">Equipment Provided</label>

          {formData.dynamicFields.equipmentProvided.map((value, index) => (
            <div key={index} className="d-flex mb-2">
              <input
                type="text"
                className="form-control me-2"
                value={formData.dynamicFields.equipmentProvided[index]}
                onChange={(e) =>
                  handleDynamicFieldChange(e, "equipmentProvided", index)
                }
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mb-3 btn btn-primary"
          onClick={() => addDynamicField("equipmentProvided")}
        >
          + Add
        </button>

        {/* Stadium Type */}
        <div className="mb-3">
          <label htmlFor="stadiumType" className="form-label text-black">
            Stadium Type
          </label>
          <select
            className="form-select"
            id="stadiumType"
            name="stadiumType"
            value={formData.stadiumType}
            onChange={handleInputChange}
          >
            <option value="">Select Type</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
          </select>
        </div>

        {/* Sports Hours */}
        <div className="mb-3">
          <label htmlFor="sportsHours" className="form-label text-black">
            Sports Hours
          </label>
          <input
            type="text"
            className="form-control"
            id="sportsHours"
            name="sportsHours"
            placeholder="e.g., 01:00 PM - 01:00 AM"
            value={formData.sportsHours}
            onChange={handleInputChange}
          />
        </div>

        {/* City */}
        <div className="mb-3">
          <label htmlFor="city" className="form-label text-black">
            City
          </label>
          <input
            type="text"
            className="form-control"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
        </div>

        {/* Country */}
        <div className="mb-3">
          <label htmlFor="country" className="form-label text-black">
            Country
          </label>
          <input
            type="text"
            className="form-control"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label text-black">
            Price (Rs/Hour)
          </label>
          <input
            type="text"
            className="form-control"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label text-black">Upload Images</label>
          {formData.photos.map((photo, index) => (
            <div key={index} className="d-flex mb-2 align-items-center">
              <input
                type="file"
                className="form-control me-2"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, index)}
              />
              {photo && (
                <div className="ms-3">
                  {/* Display preview if photo is a file */}
                  {typeof photo === "object" ? (
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index}`}
                      className="img-thumbnail"
                      style={{ width: "100px", height: "100px" }}
                    />
                  ) : (
                    /* Display preview if photo is a URL (fallback) */
                    <img
                      src={photo}
                      alt={`Preview ${index}`}
                      className="img-thumbnail"
                      style={{ width: "100px", height: "100px" }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={addImageField}
          >
            + Add Image
          </button>
        </div>

        {/* Latitude */}
        <div className="mb-3">
          <label htmlFor="latitude" className="form-label">
            Latitude
          </label>
          <input
            type="text"
            className="form-control"
            id="latitude"
            name="latitude"
            value={formData.latitude || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Longitude */}
        <div className="mb-3">
          <label htmlFor="longitude" className="form-label">
            Longitude
          </label>
          <input
            type="text"
            className="form-control"
            id="longitude"
            name="longitude"
            value={formData.longitude || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Map */}
        <div className="mb-3">
          <Map latitude={formData.latitude} longitude={formData.longitude} />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-success">
          Update Ground
        </button>
      </form>
    </div>
  );
}
