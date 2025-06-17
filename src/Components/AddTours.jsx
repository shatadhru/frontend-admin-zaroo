import React, { useState, useEffect } from "react";
import axios from "axios";
import { LuPlus } from "react-icons/lu";
import { AiOutlineMinus, AiOutlineClose } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";

const SERVER_URL = "https://server.zaroo.co"; // Replace with your server URL

function AddTours() {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  const [formdata, setFormdata] = useState({
    packageName: "",
    location: "",
    price: "",
    totalNights: "",
    policies: "",
    hotelDetails: "",
    contactDetails: "",
    isPremium: false,
    category: "",
    review: "",
    expression: "good",
  });

  const [amenities, setAmenities] = useState("");
  const [amenitiesValues, setAmenitiesValues] = useState([]);
  const [surroundTitle, setSurroundTitle] = useState("");
  const [surroundDistance, setSurroundDistance] = useState("");
  const [surroundingsList, setSurroundingsList] = useState([]);

  // Socket connection for categories with loading states
  useEffect(() => {

    // Show loading when connecting
    setCategoriesLoading(true);
    toast.loading("Loading categories...");

   
   const fetchCatagories = async () => {

    try {
      const response = await axios.get(`${SERVER_URL}/api/catagories/find`);

      if (response.data && response.data.length > 0) {
        setAllCategories(response.data);
        setCategoriesLoaded(true);
        toast.dismiss();
        toast.success("Categories loaded successfully!");
      } else {
        toast.dismiss();
        toast.error("No categories found");
      }
      setCategoriesLoading(false);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to load categories");
      console.error("Connection error:", error);
      setCategoriesLoading(false);
    }
   }

   fetchCatagories();
    

    
   

  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add amenity
  const handleAmenities = () => {
    if (amenities.trim() !== "") {
      setAmenitiesValues([...amenitiesValues, amenities.trim()]);
      setAmenities("");
      toast.success("Amenity added!");
    } else {
      toast.error("Amenity cannot be empty");
    }
  };

  // Remove amenity by index
  const handleDeleteAmenity = (index) => {
    setAmenitiesValues(amenitiesValues.filter((_, i) => i !== index));
    toast("Amenity removed", { icon: "🗑️" });
  };

  // Add surrounding place with distance
  const handleAddSurrounding = () => {
    if (surroundTitle.trim() && surroundDistance.trim()) {
      setSurroundingsList([
        ...surroundingsList,
        { title: surroundTitle, distance: surroundDistance },
      ]);
      setSurroundTitle("");
      setSurroundDistance("");
      toast.success("Surrounding place added!");
    } else {
      toast.error("Both title and distance are required");
    }
  };

  // Remove surrounding by index
  const handleDeleteSurrounding = (index) => {
    setSurroundingsList(surroundingsList.filter((_, i) => i !== index));
    toast("Surrounding removed", { icon: "🗑️" });
  };

  // Handle file input change and preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setImage(URL.createObjectURL(selectedFile));
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImage(null);
    setFile(null);
    toast("Image removed");
  };

  // Upload image to backend
  const upload = async () => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const res = await axios.post(
        "https://server.zaroo.co/api/uploads",
        formData
      );
      setLoading(false);
      toast.success("Image uploaded successfully!");
      return `https://server.zaroo.co${res.data.filePath}`;
    } catch (err) {
      setLoading(false);
      toast.error("Image upload failed!");
      console.error("Upload failed:", err);
      return "";
    }
  };

  // Submit the full form data
  const handleSubmit = async () => {
    // Check if categories are loaded first
    if (!categoriesLoaded) {
      toast.error("Please wait while categories are loading");
      return;
    }

    // Validate other form fields
    if (
      !formdata.packageName.trim() ||
      !formdata.location.trim() ||
      !formdata.price ||
      !formdata.totalNights ||
      !formdata.category ||
      amenitiesValues.length === 0 ||
      surroundingsList.length === 0 ||
      !formdata.policies.trim() ||
      !formdata.hotelDetails.trim() ||
      !formdata.contactDetails.trim() ||
      !file
    ) {
      toast.error(
        "All fields including image, amenities, and surroundings are required."
      );
      return;
    }

    setLoading(true);
    const uploadedImageUrl = await upload();

    if (!uploadedImageUrl) {
      setLoading(false);
      toast.error("Image upload failed. Please try again.");
      return;
    }

    const fullData = {
      ...formdata,
      amenities: amenitiesValues,
      surroundings: surroundingsList,
      image: uploadedImageUrl,
    };

    try {
      const res = await axios.post("https://server.zaroo.co/api/tours", fullData);
      toast.success("Tour added successfully!");
      setLoading(false);

      // Reset all form states
      setFormdata({
        packageName: "",
        location: "",
        price: "",
        totalNights: "",
        policies: "",
        hotelDetails: "",
        contactDetails: "",
        isPremium: false,
        category: "",
        review: "",
        expression: "good",
      });
      setAmenitiesValues([]);
      setSurroundingsList([]);
      setImage(null);
      setFile(null);

      console.log(res.data);
    } catch (error) {
      setLoading(false);
      toast.error("Error saving tour!");
      console.error("Error saving tour:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6 rounded-2xl max-w-5xl mx-auto">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="text-3xl font-bold mb-2">Package Management</h1>
      <p className="text-sm text-gray-600 mb-6">
        Dashboard to manage installed packages, amenities, and surroundings.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package Name */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Package Name</label>
          <input
            name="packageName"
            value={formdata.packageName}
            onChange={handleChange}
            type="text"
            className="border border-blue-600 rounded-lg py-3 px-4 bg-white focus:ring-2 ring-blue-600 transition"
            placeholder="Enter Package Name"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Exact Location</label>
          <input
            name="location"
            value={formdata.location}
            onChange={handleChange}
            type="text"
            className="border border-blue-600 rounded-lg py-3 px-4 bg-white focus:ring-2 ring-blue-600 transition"
            placeholder="Enter Exact Location"
          />
        </div>

        {/* Category Dropdown with loading state */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Category</label>
          {categoriesLoading ? (
            <div className="border border-blue-600 rounded-lg py-3 px-4 bg-gray-100 animate-pulse">
              Loading categories...
            </div>
          ) : (
            <select
              name="category"
              value={formdata.category}
              onChange={handleChange}
              className="border border-blue-600 rounded-lg py-3 px-4 bg-white focus:ring-2 ring-blue-600 transition"
              required
              disabled={!categoriesLoaded}
            >
              <option value="">
                {categoriesLoaded
                  ? "Select a category"
                  : "Loading categories..."}
              </option>
              {categoriesLoaded &&
                allCategories.map((item, index) => (
                  <option key={index} value={item.catagories}>
                    {item.catagories}
                  </option>
                ))}
            </select>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Price</label>
          <input
            name="price"
            value={formdata.price}
            onChange={handleChange}
            type="number"
            min="0"
            className="border border-blue-600 rounded-lg py-3 px-4 bg-white focus:ring-2 ring-blue-600 transition"
            placeholder="Enter Price"
          />
        </div>

        {/* Total Nights */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Total Nights</label>
          <input
            name="totalNights"
            value={formdata.totalNights}
            onChange={handleChange}
            type="number"
            min="1"
            className="border border-blue-600 rounded-lg py-3 px-4 bg-white focus:ring-2 ring-blue-600 transition"
            placeholder="Enter Total Nights"
          />
        </div>

        {/* Review Input */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Review</label>
          <input
            name="review"
            value={formdata.review}
            onChange={handleChange}
            type="text"
            className="border border-blue-600 rounded-lg py-3 px-4 bg-white focus:ring-2 ring-blue-600 transition"
            placeholder="Enter Review"
          />
        </div>

        {/* Expression Dropdown (Premium) */}
        {formdata.isPremium && (
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Expression</label>
            <select
              name="expression"
              value={formdata.expression}
              onChange={handleChange}
              className="border border-blue-600 rounded-lg py-3 px-4 bg-white focus:ring-2 ring-blue-600 transition"
            >
              <option value="good">Good</option>
              <option value="very good">Very Good</option>
              <option value="bad">Bad</option>
            </select>
          </div>
        )}

        {/* Amenities Input */}
        <div className="flex flex-wrap items-end gap-3 col-span-2">
          <div className="flex flex-col w-full max-w-md">
            <label className="mb-2 font-semibold">Amenities</label>
            <input
              type="text"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              className="border border-blue-600 rounded-lg py-3 px-4 bg-white focus:ring-2 ring-blue-600 transition"
              placeholder="Enter Amenity"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAmenities();
                }
              }}
            />
          </div>
          <button
            onClick={handleAmenities}
            className="rounded-full w-10 h-10 flex items-center justify-center bg-green-500 text-white hover:bg-green-600 transition"
            title="Add Amenity"
          >
            <LuPlus size={22} />
          </button>
        </div>

        {/* Amenities List */}
        <div className="col-span-2 bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold mb-4">All Amenities</h2>
          {amenitiesValues.length === 0 && (
            <p className="text-sm text-gray-400">No amenities added yet.</p>
          )}
          {amenitiesValues.map((item, index) => (
            <div
              key={index}
              className="bg-blue-100 px-5 py-3 rounded-lg mb-3 flex justify-between items-center"
            >
              <span className="font-medium">{item}</span>
              <button
                onClick={() => handleDeleteAmenity(index)}
                className="text-red-600 hover:text-red-800 transition"
                title="Remove Amenity"
              >
                <AiOutlineMinus size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Surroundings Section */}
        <div className="col-span-2 mt-8">
          <h2 className="text-xl font-semibold mb-4">Surroundings</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <input
              type="text"
              value={surroundTitle}
              onChange={(e) => setSurroundTitle(e.target.value)}
              placeholder="Place Name"
              className="border border-blue-600 rounded-lg py-3 px-4 bg-white focus:ring-2 ring-blue-600 transition w-full sm:w-60"
            />
            <input
              type="text"
              value={surroundDistance}
              onChange={(e) => setSurroundDistance(e.target.value)}
              placeholder="Distance (e.g. 5km)"
              className="border border-blue-600 rounded-lg py-3 px-4 bg-white focus:ring-2 ring-blue-600 transition w-full sm:w-60"
            />
            <button
              onClick={handleAddSurrounding}
              className="rounded-full w-10 h-10 flex items-center justify-center bg-green-500 text-white hover:bg-green-600 transition"
              title="Add Surrounding"
            >
              <LuPlus size={22} />
            </button>
          </div>

          {/* Surroundings List */}
          <div className="mt-5 space-y-3">
            {surroundingsList.length === 0 && (
              <p className="text-sm text-gray-400">
                No surroundings added yet.
              </p>
            )}
            {surroundingsList.map((s, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-green-100 px-5 py-3 rounded-lg"
              >
                <span>
                  <strong>{s.title}</strong> - {s.distance}
                </span>
                <button
                  onClick={() => handleDeleteSurrounding(i)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Remove Surrounding"
                >
                  <AiOutlineMinus size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Policies */}
        <div className="flex flex-col col-span-2 mt-6">
          <label className="mb-2 font-semibold">Policies</label>
          <textarea
            name="policies"
            value={formdata.policies}
            onChange={handleChange}
            rows={5}
            placeholder="Write your policies here..."
            className="border border-blue-600 rounded-lg py-3 px-4 bg-white focus:ring-2 ring-blue-600 placeholder-gray-400 italic transition"
          />
        </div>

        {/* Hotels */}
        <div className="flex flex-col col-span-2 mt-6">
          <label className="mb-2 font-semibold">Hotels Details</label>
          <textarea
            name="hotelDetails"
            value={formdata.hotelDetails}
            onChange={handleChange}
            rows={5}
            placeholder="Write your Hotels Details here..."
            className="border border-blue-600 rounded-lg py-3 px-4 bg-white focus:ring-2 ring-blue-600 placeholder-gray-400 italic transition"
          />
        </div>

        {/* Contact */}
        <div className="flex flex-col col-span-2 mt-6">
          <label className="mb-2 font-semibold">
            Explained Contact Details
          </label>
          <textarea
            name="contactDetails"
            value={formdata.contactDetails}
            onChange={handleChange}
            rows={5}
            placeholder="Write your Explained Contact Details here..."
            className="border border-blue-600 rounded-lg py-3 px-4 bg-white focus:ring-2 ring-blue-600 placeholder-gray-400 italic transition"
          />
        </div>
      </div>

      {/* File upload */}
      <div className="mt-8">
        <label className="flex items-center space-x-2 font-bold text-xl mb-3">
          Upload Banner
        </label>
        <input
          type="file"
          className="file:bg-blue-100 file:px-4 file:py-2 file:rounded-lg file:border file:border-blue-600 cursor-pointer"
          onChange={handleFileChange}
          disabled={loading}
        />
        {image && (
          <div className="relative mt-4 w-48 h-36 rounded-xl overflow-hidden shadow-lg">
            <img
              src={image}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1 hover:bg-red-600 hover:text-white transition"
              title="Remove Image"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Premium Checkbox */}
      <label className="flex items-center space-x-3 mt-6">
        <input
          type="checkbox"
          name="isPremium"
          checked={formdata.isPremium}
          onChange={handleChange}
          disabled={loading}
          className="w-5 h-5 cursor-pointer"
        />
        <span className="text-blue-900 font-semibold select-none">
          Mark as Premium
        </span>
      </label>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !categoriesLoaded}
        className={`mt-8 w-full lg:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold
          hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? "Saving..." : "Save Tour"}
      </button>
    </div>
  );
}

export default AddTours;
