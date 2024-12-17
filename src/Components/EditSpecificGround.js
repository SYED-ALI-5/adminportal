import React, { useState, useEffect } from "react";
import Map from "./Map";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EditSpecificGround() {
  const { id } = useParams(); // Ground ID passed in URL
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    description: "",
    latitude: "",
    longitude: "",
    stadiumFacilities: [],
    equipmentProvided: [],
    stadiumType: "",
    sportsHours: "",
    city: "",
    country: "",
    photos: [],
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

  // Fetch all ground data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch ground data
        const groundRes = await axios.get(`/api/grounds/${id}`);
        const groundData = groundRes.data;

        // Fetch stadium facilities
        const facilitiesRes = await axios.get(
          `/api/stadiumfacilities?groundId=${id}`
        );

        // Fetch equipment provided
        const equipmentRes = await axios.get(
          `/api/equipmentprovided?groundId=${id}`
        );

        // Fetch images
        const imagesRes = await axios.get(`/api/groundimages?groundId=${id}`);

        // Fetch pitches
        const pitchesRes = await axios.get(`/api/pitches?groundId=${id}`);

        // Set all data to form state
        setFormData({
          ...formData,
          name: groundData.name || "",
          phone: groundData.phone || "",
          address: groundData.address || "",
          description: groundData.description || "",
          latitude: groundData.latitude || "",
          longitude: groundData.longitude || "",
          stadiumType: groundData.stadiumType || "",
          city: groundData.city || "",
          country: groundData.country || "",
          sportsHours: groundData.sportsHours || "",
          photos: imagesRes.data.map((img) => img.url) || [], // Assuming each image has a URL
          pitches:
            pitchesRes.pitches.length > 0
              ? pitchesRes.pitches
              : [
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
          stadiumFacilities: facilitiesRes.data || [],
          equipmentProvided: equipmentRes.data || [],
        });
      } catch (error) {
        console.error("Error fetching ground details:", error);
      }
    };

    fetchData();
  }, [id]);

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

  // Add and Update Facilities/Equipment
  const handleArrayChange = (e, index, field) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = e.target.value;
    setFormData({ ...formData, [field]: updatedArray });
  };

  const addToArray = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedPhotos = [...formData.photos];
      updatedPhotos[index] = file; // Add the new file object
      setFormData({ ...formData, photos: updatedPhotos });
    }
  };

  const addImageField = () => {
    setFormData({ ...formData, photos: [...formData.photos, null] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Update Ground Table
      await axios.put(`/api/grounds/${id}`, {
        name: formData.name,
        phone: formData.phone,
        description: formData.description,
        address: formData.address,
        stadiumType: formData.stadiumType,
        sportsHours: formData.sportsHours,
        city: formData.city,
        country: formData.country,
        price: formData.price,
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      // 2. Update Stadium Facilities Table
      await axios.put(`/api/stadiumfacilities/${id}`, {
        facilities: formData.stadiumFacilities,
      });

      // 3. Update Equipment Provided Table
      await axios.put(`/api/equipmentprovided/${id}`, {
        equipment: formData.equipmentProvided,
      });

      const photosInBase64 = await Promise.all(
        formData.photos.map(async (photo) => {
          if (photo instanceof File) {
            return await toBase64(photo); // Convert new files to Base64
          }
          return photo; // Existing URLs remain unchanged
        })
      );

      // 4. Update Ground Images Table
      await axios.put(`/api/groundimages/${id}`, {
        images: photosInBase64, // New files as Base64 + Existing URLs
      });

      // 5. Update Pitches Table
      await axios.put(`/api/pitches/${id}`, {
        pitches: formData.pitches,
      });

      alert("Ground and related data updated successfully!");
    } catch (error) {
      console.error("Error updating ground details:", error);
      alert("Failed to update ground data.");
    }
  };

  // Utility function to convert a file to Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Extract Base64 part
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="container my-5">
      <h1 className="text-center" style={{ color: "rgb(57 171 148)" }}>
        Edit Ground
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Ground Name */}
        <div className="mb-3">
          <label className="form-label">Ground Name</label>
          <input
            type="text"
            className="form-control"
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
        {/* address */}
        <div className="mb-3">
          <label htmlFor="address" className="form-label text-black">
            address
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
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
                <label className="form-label text-black">Length (meters)</label>
                <input
                  type="text"
                  className="form-control"
                  name="length"
                  value={pitch.length}
                  onChange={(e) => handlePitchChange(index, e)}
                  placeholder="Enter length"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-black">Width (meters)</label>
                <input
                  type="text"
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
                  type="text"
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
                  type="text"
                  className="form-control"
                  name="price_per_90mins"
                  value={pitch.price_per_90mins}
                  onChange={(e) => handlePitchChange(index, e)}
                  placeholder="Enter price (Rs)"
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label text-black">Pitch Description</label>
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

          {formData.stadiumFacilities.map((item, index) => (
            <div key={index} className="d-flex mb-2">
              <input
                type="text"
                className="form-control me-2"
                value={item}
                onChange={(e) =>
                  handleArrayChange(e, index, "stadiumFacilities")
                }
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mb-3 btn btn-primary"
          onClick={() => addToArray("stadiumFacilities")}
        >
          + Add
        </button>

        {/* Equipment Provided */}
        <div className="d-flex flex-column">
          <label className="form-label text-black">Equipment Provided</label>

          {formData.equipmentProvided.map((item, index) => (
            <div key={index} className="d-flex mb-2">
              <input
                type="text"
                className="form-control me-2"
                value={item}
                onChange={(e) =>
                  handleArrayChange(e, index, "equipmentProvided")
                }
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mb-3 btn btn-primary"
          onClick={() => addToArray("equipmentProvided")}
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
        {/* Latitude for Map */}
        <div className="mb-3">
          <label className="form-label">Latitude</label>
          <input
            type="text"
            className="form-control"
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
          />
        </div>
        {/* Longitude for Map */}
        <div className="mb-3">
          <label className="form-label">Longitude</label>
          <input
            type="text"
            className="form-control"
            name="longitude"
            value={formData.longitude}
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

        {/* Map */}
        <div className="container w-75">
          <h3 className="text-center">Select Ground Location</h3>
          <div className="w-100">
            <Map latitude={formData.latitude} longitude={formData.longitude} />
          </div>
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-success">
            Update Ground
          </button>
        </div>
      </form>
    </div>
  );
}
