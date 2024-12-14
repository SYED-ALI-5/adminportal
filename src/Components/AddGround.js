import React, { useState } from "react";
import Map from "./Map";
import axios from "axios";

export default function AddGround() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    description: "",
    latitude: "",
    longitude: "",
    address: "",
    city: "",
    country: "",
    price: "",
    images: [],
    dynamicFields: {
      pitchTypes: [],
      stadiumFacilities: [],
      equipmentProvided: [],
    },
    stadiumType: "",
    sportsHours: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDynamicFieldChange = (e, fieldName, index) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedFields = [...prevData.dynamicFields[fieldName]];
      updatedFields[index] = value;
      return {
        ...prevData,
        dynamicFields: {
          ...prevData.dynamicFields,
          [fieldName]: updatedFields,
        },
      };
    });
  };

  const addDynamicField = (fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      dynamicFields: {
        ...prevData.dynamicFields,
        [fieldName]: [...prevData.dynamicFields[fieldName], ""],
      },
    }));
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result.split(",")[1]; // Extract Base64 part
        setFormData((prevData) => {
          const updatedImages = [...prevData.images];
          updatedImages[index] = base64Image; // Save Base64 string
          return { ...prevData, images: updatedImages };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageField = () => {
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, null],
    }));
  };

  const handleMapClick = (latitude, longitude) => {
    setFormData((prevData) => ({
      ...prevData,
      latitude,
      longitude,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("YOUR_API_ENDPOINT_HERE", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Form Data Submitted Successfully: ", response.data);
      alert("Ground added successfully!");

      setFormData({
        name: "",
        phone: "",
        description: "",
        latitude: "",
        longitude: "",
        address: "",
        city: "",
        country: "",
        price: "",
        images: [],
        dynamicFields: {
          pitchTypes: [],
          stadiumFacilities: [],
          equipmentProvided: [],
        },
        stadiumType: "",
        sportsHours: "",
      });
    } catch (error) {
      console.error("Error submitting form data: ", error);
      alert("Failed to add ground. Please try again.");
    }
  };

  return (
    <>
      <div className="container my-5">
        <h1 style={{ color: "rgb(57 171 148)" }} className="text-center">
          Add Ground
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-black">
              Ground Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
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

          {/* Pitch Types */}
          <div className="d-flex flex-column">
            <label className="form-label text-black">Pitch Types</label>

            {/* Ensure at least one input field is always visible */}
            {formData.dynamicFields.pitchTypes.length === 0 && (
              <div className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  value="" // Empty input initially
                  onChange={(e) => handleDynamicFieldChange(e, "pitchTypes", 0)}
                />
              </div>
            )}

            {/* Render existing input fields */}
            {formData.dynamicFields.pitchTypes.map((value, index) => (
              <div key={index} className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  value={value}
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

            {/* Ensure at least one input field is always visible */}
            {formData.dynamicFields.stadiumFacilities.length === 0 && (
              <div className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  value="" // Empty input initially
                  onChange={(e) =>
                    handleDynamicFieldChange(e, "stadiumFacilities", 0)
                  }
                />
              </div>
            )}

            {formData.dynamicFields.stadiumFacilities.map((value, index) => (
              <div key={index} className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  value={value}
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

            {/* Ensure at least one input field is always visible */}
            {formData.dynamicFields.equipmentProvided.length === 0 && (
              <div className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  value="" // Empty input initially
                  onChange={(e) =>
                    handleDynamicFieldChange(e, "equipmentProvided", 0)
                  }
                />
              </div>
            )}

            {formData.dynamicFields.equipmentProvided.map((value, index) => (
              <div key={index} className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  value={value}
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

          {/* Location */}
          <div className="mb-3">
            <label htmlFor="location" className="form-label text-black">
              Addres
            </label>
            <input
              type="text"
              className="form-control"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>

          {/* Price */}
          <div className="mb-3">
            <label htmlFor="price" className="form-label text-black">
              Price (Rs/Hour)
            </label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label text-black">
              Latitude
            </label>
            <input
              type="text"
              className="form-control"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label text-black">
              Longitude
            </label>
            <input
              type="text"
              className="form-control"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
            />
          </div>

          {/* Image Upload */}
          <div className="mb-3">
            <label className="form-label text-black">Upload Images</label>

            {formData.images.length === 0 && (
              <div className="d-flex mb-2 align-items-center">
                <input
                  type="file"
                  className="form-control me-2"
                  onChange={(e) => handleImageUpload(e, 0)}
                />
              </div>
            )}

            {formData.images.map((image, index) => (
              <div key={index} className="d-flex mb-2 align-items-center">
                <input
                  type="file"
                  className="form-control me-2"
                  onChange={(e) => handleImageUpload(e, index)}
                />
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

          {/* Map */}
          <div className="container w-75">
            <h3 className="text-center">Select Ground Location</h3>
            <div className="w-100">
              <Map onMapClick={handleMapClick} />
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-flex justify-content-center mt-4">
            <button type="submit" className="btn btn-success">
              Add Ground
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
