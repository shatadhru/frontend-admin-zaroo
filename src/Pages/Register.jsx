import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BounceLoader, ClipLoader } from "react-spinners";
import { io } from "socket.io-client";

const SERVER_URL = "https://server.zaroo.co";
const socket = io(SERVER_URL);

function Register() {
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [UserValidationMessage, setUserValidationMessage] = useState("");
  const [isSubmitEnable, setisSubmitEnable] = useState(false);
  const [UserValidationloading, setUserValidationLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Username validation handler
  const UserNameAvailableHandaler = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value.length > 2) {
      socket.emit("cheak-username", value);
      setUserValidationLoading(true);
    }
  };
  useEffect(() => {
    socket.on("user-available", (data) => {
      setUserValidationLoading(false);

      // ✅ Proper comparison
      if (data.available === true || data.message === "User Available") {
        setUserValidationMessage("✅ Username available");
        setisSubmitEnable(true);
      } else {
        setUserValidationMessage("❌ Username not available");
        setisSubmitEnable(false);
      }
    });

    return () => socket.off("user-available");
  }, []);
  

  // ✅ Simple email checker
  const ValidateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ✅ Form submit
  const HandleRegister = async () => {
    if (!username || !useremail || !password || !ConfirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (password !== ConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!ValidateEmail(useremail)) {
      toast.error("Invalid email");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${SERVER_URL}/auth/register`, {
        username,
        useremail,
        password,
      });
      toast.success(res.data.message || "Registration successful");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-black border-2 border-white rounded-2xl p-6">
        <h1 className="text-center font-bold text-2xl text-white mb-6">
          Register
        </h1>

        <input
          type="text"
          className="w-full bg-gray-200 py-2 px-4 rounded-md outline-none"
          placeholder="Username"
          value={username}
          onChange={UserNameAvailableHandaler}
        />
        <p className="text-green-500 text-sm py-1 flex items-center gap-2">
          {UserValidationMessage}
          {UserValidationloading && <ClipLoader size={12} color="#fff" />}
        </p>

        <input
          type="email"
          className="w-full bg-gray-200 py-2 px-4 mb-4 rounded-md outline-none"
          placeholder="Email"
          value={useremail}
          onChange={(e) => setUseremail(e.target.value)}
        />
        <input
          type="password"
          className="w-full bg-gray-200 py-2 px-4 mb-4 rounded-md outline-none"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="w-full bg-gray-200 py-2 px-4 mb-4 rounded-md outline-none"
          placeholder="Confirm Password"
          value={ConfirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={HandleRegister}
          disabled={loading || !isSubmitEnable}
          className="w-full bg-white text-black rounded-full py-2 hover:bg-gray-100 transition disabled:opacity-60 flex justify-center"
        >
          {loading ? <BounceLoader size={20} color="#000" /> : "Register"}
        </button>

        <p className="text-white text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Login Now
          </a>
        </p>

        <Toaster />
      </div>
    </div>
  );
}

export default Register;
