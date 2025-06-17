import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { IoIosClose } from "react-icons/io";

function Tour() {
  const SERVER_URL = "https://server.zaroo.co";

  const [categoryName, setCategoryName] = useState("");
  const [allCategoryList, setAllCategoryList] = useState([]);

  // ✅ Create Category
  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty!");
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/api/catagories`, {
        catagoryName: categoryName,
      });
      toast.success(response.data.message);
      setCategoryName("");
      fetchAllCategories(); // 🔄 Refresh list
    } catch (error) {
      toast.error("Server error. Please try again.");
      console.error(error);
    }
  };

  // ✅ Fetch All Categories
  const fetchAllCategories = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/catagories/find`);
      setAllCategoryList(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error(error);
    }
  };

  // ✅ Delete Category
  const handleDeleteCategory = async (name) => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/catagories/delete`, {
        name,
      });
      toast.success(response.data.message);
      fetchAllCategories(); // 🔄 Refresh list
    } catch (error) {
      toast.error("Failed to delete category. Please try again.");
      console.error(error);
    }
  };

  // ✅ Load categories on component mount
  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <div>
      <h1 className="text-xl lg:text-2xl text-black font-bold">
        Tour Package Management
      </h1>
      <p>
        Design every detail, manage every moment, and delight every traveler —
        your tours, your way, with total control and creative freedom.
      </p>

      <h2 className="text-sm lg:text-xl font-semibold mt-10">
        Create Categories
      </h2>
      <p>
        To get started, you must first create a category — the foundation of
        every organized tour experience.
      </p>

      <div className="flex w-[90%] lg:w-3/5 h-15 rounded-full bg-white shadow-2xl mt-6">
        <input
          type="text"
          className="outline-none w-full lg:w-[80%] pl-10 text-xl"
          placeholder="Enter Your Tour Category ..."
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        <button
          onClick={handleCreateCategory}
          className="bg-gradient-to-b from-blue-800 to-blue-600 hover:from-blue-600 hover:to-blue-800 px-10 py-2 m-2 rounded-full transition-colors duration-300 cursor-pointer text-white"
        >
          Create
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 mt-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          🎯 All Tour Categories
        </h3>

        <div className="max-h-60 overflow-y-auto pr-2">
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {allCategoryList.length === 0 ? (
              <li className="text-gray-500">No categories found.</li>
            ) : (
              allCategoryList.map((item, index) => {
                const bgColors = [
                  "bg-blue-100 text-blue-800",
                  "bg-green-100 text-green-800",
                  "bg-pink-100 text-pink-800",
                  "bg-yellow-100 text-yellow-800",
                  "bg-purple-100 text-purple-800",
                  "bg-orange-100 text-orange-800",
                  "bg-teal-100 text-teal-800",
                  "bg-rose-100 text-rose-800",
                  "bg-indigo-100 text-indigo-800",
                ];
                const randomColor = bgColors[index % bgColors.length];

                return (
                  <li
                    key={item._id}
                    className={`${randomColor} flex items-center justify-center gap-3 text-sm font-medium px-3 py-1 rounded-full shadow-sm`}
                  >
                    {item.catagories}
                    <IoIosClose
                      className="text-red-600 text-2xl cursor-pointer hover:bg-red-100 rounded-full"
                      onClick={() => handleDeleteCategory(item.catagories)}
                    />
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default Tour;
