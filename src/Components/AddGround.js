import React, { useState } from "react";
import Map from "./Map";

export default function AddGround() {
  const [formData, setFormData] = useState({
    groundName: "",
    phone: "",
    groundDescription: "",
    latitude: "",
    longitude: "",
    addres: "",
    city: "",
    country: "",
    images: [],
    dynamicFields: {
      stadiumFacilities: [],
      equipmentProvided: [],
    },
    stadiumType: "",
    sportsHours: "",
    pitches: [
      {
        pitchName: "",
        pitchDescription: "",
        length: "",
        width: "",
        game_type: "",
        price_per_60mins: "",
        price_per_90mins: "",
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePitchChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPitches = [...formData.pitches];
    updatedPitches[index][name] = value;
    setFormData({ ...formData, pitches: updatedPitches });
  };

  const addPitchField = () => {
    setFormData((prevState) => ({
      ...prevState,
      pitches: [
        ...prevState.pitches,
        {
          pitchName: "",
          pitchDescription: "",
          length: "",
          width: "",
          game_type: "",
          price_per_60mins: "",
          price_per_90mins: "",
        },
      ],
    }));
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

  // Function to handle Base64 conversion of images
  const handleImageChange = (e) => {
    const files = e.target.files;

    const imagePromises = Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result); // Base64 string
        reader.onerror = (error) => reject(error);
      });
    });

    Promise.all(imagePromises)
      .then((base64Images) => {
        setFormData((prev) => ({
          ...prev,
          images: base64Images, // Store all images as Base64 strings
        }));
      })
      .catch((error) => console.error("Image conversion error:", error));
  };

  const addImageField = () => {
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, null], // Add a new empty slot
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Submit General Ground Data
      const groundResponse = await axios.post(
        "http://localhost:5000/api/ground",
        formData
      );
      const groundId = groundResponse.data.groundId;

      // 2. Submit Stadium Facilities
      if (formData.dynamicFields.stadiumFacilities.length > 0) {
        await axios.post("http://localhost:5000/api/ground/facilities", {
          groundId,
          facilities: formData.dynamicFields.stadiumFacilities,
        });
      }

      // 3. Submit Equipment Provided
      if (formData.dynamicFields.equipmentProvided.length > 0) {
        await axios.post("http://localhost:5000/api/ground/equipment", {
          groundId,
          equipment: formData.dynamicFields.equipmentProvided,
        });
      }

      // 4. Submit Pitches
      if (formData.pitches.length > 0) {
        await axios.post("http://localhost:5000/api/ground/pitches", {
          groundId,
          pitches: formData.pitches,
        });
      }

      // 5. Submit Images
      if (formData.images.length > 0) {
        const imageUrls = formData.images.map((image) => image.name); // Replace this with actual image URL
        await axios.post("http://localhost:5000/api/ground/images", {
          groundId,
          images: imageUrls,
        });
      }

      alert("Ground added successfully!");
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
            <label htmlFor="groundName" className="form-label text-black">
              Ground Name
            </label>
            <input
              type="text"
              className="form-control"
              id="groundName"
              name="groundName"
              value={formData.groundName}
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

          {/* Ground Description */}
          <div className="mb-3">
            <label
              htmlFor="groundDescription"
              className="form-label text-black"
            >
              Ground Description
            </label>
            <textarea
              className="form-control"
              id="groundDescription"
              name="groundDescription"
              rows="3"
              value={formData.groundDescription}
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* Pitches Section */}
          <h3 className="mt-4 mb-3">Pitches</h3>
          {formData.pitches.map((pitch, index) => (
            <div key={index} className="border rounded p-3 mb-3 bg-light">
              <h5>Pitch {index + 1}</h5>
              <div className="row mb-2">
                <div className="col-md-6">
                  <label className="form-label text-black">Pitch Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pitchName"
                    value={pitch.pitchName}
                    onChange={(e) => handlePitchChange(index, e)}
                    placeholder="Enter pitch name"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-black">Game Type</label>
                  <input
                    type="text"
                    className="form-control"
                    name="game_type"
                    value={pitch.game_type}
                    onChange={(e) => handlePitchChange(index, e)}
                    placeholder="e.g., Football, Cricket"
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <label className="form-label text-black">
                    Length (meters)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="length"
                    value={pitch.length}
                    onChange={(e) => handlePitchChange(index, e)}
                    placeholder="Enter length"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-black">
                    Width (meters)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="width"
                    value={pitch.width}
                    onChange={(e) => handlePitchChange(index, e)}
                    placeholder="Enter width"
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <label className="form-label text-black">
                    Price per 60 mins
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="price_per_60mins"
                    value={pitch.price_per_60mins}
                    onChange={(e) => handlePitchChange(index, e)}
                    placeholder="Enter price (Rs)"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-black">
                    Price per 90 mins
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="price_per_90mins"
                    value={pitch.price_per_90mins}
                    onChange={(e) => handlePitchChange(index, e)}
                    placeholder="Enter price (Rs)"
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label text-black">
                  Pitch Description
                </label>
                <textarea
                  className="form-control"
                  name="pitchDescription"
                  value={pitch.pitchDescription}
                  onChange={(e) => handlePitchChange(index, e)}
                  rows="2"
                  placeholder="Enter pitch description"
                ></textarea>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={addPitchField}
          >
            + Add Pitch
          </button>

          {/* Stadium Facilities */}
          <div className="d-flex flex-column">
            <label className="form-label text-black">Stadium Facilities</label>
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

          <div className="mb-3">
            <label htmlFor="latitude" className="form-label text-black">
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
            <label htmlFor="longitude" className="form-label text-black">
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
            {formData.images.map((image, index) => (
              <div className="mb-3">
                <label className="form-label text-black">Upload Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="form-control"
                  onChange={handleImageChange}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={addImageField}
          >
            + Add Image
          </button>

          <div className="container w-75">
            <h3 className="text-center">Select Ground Location</h3>
            <div className="w-100">
              <Map />
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
