import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BounceLoader } from "react-spinners";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const SERVER_URL = "https://server.zaroo.co";

  const HandleLogin = async () => {
    if (!username || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${SERVER_URL}/auth/login`, {
        username,
        password,
      });

      toast.success(response.data.message);
      console.log(response.data);

      localStorage.setItem("username", username);
      
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-black border-2 border-white rounded-2xl p-6">
        <h1 className="text-center font-bold text-2xl text-white mb-6">
          Login
        </h1>

        <input
          type="text"
          className="w-full bg-gray-200 py-2 px-4 mb-4 rounded-md outline-none"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full bg-gray-200 py-2 px-4 mb-2 rounded-md outline-none"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="text-right text-white text-sm mb-4">
          <a href="/forgetpassword" className="underline">
            Forgot Password?
          </a>
        </div>

        <button
          className="w-full bg-white text-black rounded-full py-2 hover:bg-gray-100 transition flex justify-center items-center disabled:opacity-60"
          onClick={HandleLogin}
          disabled={loading}
        >
          {loading ? <BounceLoader size={20} color="#000" /> : "Login"}
        </button>

        <p className="text-white text-sm text-center mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="underline">
            Register Now
          </a>
        </p>

        <Toaster />
      </div>
    </div>
  );
}

export default Login;
