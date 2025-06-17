import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BounceLoader } from "react-spinners";

import { useNavigate } from "react-router-dom";


function ForgotPassword() {
  const [useremail, setUsermail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const SERVER_URL = "https://server.zaroo.co";

  const HandleForgotPassword = async () => {
    if (!useremail) {
      toast.error("All fields are required");
      return setLoading(false);
    }

    setLoading(true);

    try {
      const response = await axios.post(`${SERVER_URL}/auth/forgetpassword`, {
        useremail,
      });

      toast.success(response.data.message);
      navigate(`/otpVerifications?email=${useremail}`);

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-black border-2 border-white rounded-2xl p-6 flex flex-col items-center">
        <h1 className="text-center font-bold text-2xl text-white mb-6">
          Forget Password
        </h1>

        <input
          type="email"
          className="w-full bg-gray-200 py-2 px-4 rounded-md outline-none"
          placeholder="Enter your registered email"
          value={useremail}
          onChange={(e) => setUsermail(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-white text-black rounded-full py-2 mt-4 flex justify-center items-center hover:bg-gray-100 disabled:opacity-60"
          onClick={HandleForgotPassword}
          disabled={loading}
        >
          {loading ? <BounceLoader size={20} color="#000" /> : "Send Code"}
        </button>

        <p className="text-white text-sm text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="underline">
            Register
          </a>
        </p>

        <Toaster />
      </div>
    </div>
  );
}

export default ForgotPassword;
