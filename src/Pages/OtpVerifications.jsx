import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BounceLoader } from "react-spinners";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputOtp } from "primereact/inputotp";
import { useLocation, useNavigate } from "react-router-dom";

function OtpVerifications() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const SERVER_URL = "https://server.zaroo.co";

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const useremail = queryParams.get("email");

  const navigate = useNavigate();

  // ✅ OTP Verification Handler
  const HandleOtpVerifications = async () => {
    if (!otp) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${SERVER_URL}/auth/otp_verifications`,
        {
          otp,
          useremail,
        }
      );

      toast.success(response.data.message);

      navigate(`/resetPassword?email=${useremail}`);

      console.log(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP Handler
  const ResendCodeHandaler = async () => {
    setResending(true);

    const resendPromise = axios.post(`${SERVER_URL}/auth/forgetpassword`, {
      useremail,
    });

    toast.promise(resendPromise, {
      loading: "Resending OTP...",
      success: "OTP sent successfully!",
      error: "Failed to resend OTP",
    });

    try {
      await resendPromise;
    } catch (error) {
      console.log(error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-black border-2 border-white rounded-2xl p-6 flex flex-col items-center">
        <h1 className="text-center font-bold text-2xl text-white mb-6">
          Verify Code
        </h1>

        <div className="card flex justify-content-center text-white border-none">
          <InputOtp value={otp} onChange={(e) => setOtp(e.value)} integerOnly />
        </div>

        <button
          type="submit"
          className="w-full bg-white text-black rounded-full py-2 mt-4 flex justify-center items-center hover:bg-gray-100 disabled:opacity-60"
          onClick={HandleOtpVerifications}
          disabled={loading}
        >
          {loading ? <BounceLoader size={20} color="#000" /> : "Verify Code"}
        </button>

        <p className="text-gray-200 text-[12px] text-center mt-4">
          Your OTP is valid for 5 minutes only. Please complete the verification
          promptly.
        </p>

        <p className="text-white text-sm text-center mt-4">
          Didn't get the code?
          <button
            type="button"
            onClick={ResendCodeHandaler}
            className="underline ml-1 text-blue-400 hover:text-blue-200 disabled:opacity-50"
            disabled={resending}
          >
            {resending ? "Resending..." : "Resend"}
          </button>
        </p>

        <Toaster />
      </div>
    </div>
  );
}

export default OtpVerifications;
