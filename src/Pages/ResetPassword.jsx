import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BounceLoader } from "react-spinners";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const SERVER_URL = "https://server.zaroo.co";

  const location = useLocation();
  const quaryParams = new URLSearchParams(location.search); 
  const useremail =  quaryParams.get("email");

  const HandleReset = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${SERVER_URL}/auth/resetPassword`, {
        useremail,
        newPassword,
      });

      toast.success(response.data.message);
      console.log(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-screen min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-black border-2 border-white rounded-2xl p-6">
        <h1 className="text-center font-bold text-2xl text-white mb-6">
          Reset Password
        </h1>

     

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full bg-gray-200 py-2 px-4 rounded-md outline-none pr-10"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full bg-gray-200 py-2 px-4 rounded-md outline-none pr-10"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          className="w-full bg-white text-black rounded-full py-2 hover:bg-gray-100 transition flex justify-center items-center disabled:opacity-60"
          onClick={HandleReset}
          disabled={loading}
        >
          {loading ? <BounceLoader size={20} color="#000" /> : "Reset Password"}
        </button>

        <p className="text-white text-sm text-center mt-4">
          Remember your password?{" "}
          <a href="/login" className="underline">
            Login Now
          </a>
        </p>

        <Toaster />
      </div>
    </div>
  );
}

export default ResetPassword;
