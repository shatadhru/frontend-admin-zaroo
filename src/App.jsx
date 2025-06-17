import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login"
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import OtpVerifications from "./Pages/OtpVerifications";
import ResetPassword from "./Pages/ResetPassword";
import HotelAdminDashboard from "./Pages/Dashbaord";
import Dashboard from "./Pages/Dashbaord";




function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgetpassword" element={<ForgotPassword />} />
        <Route path="/otpVerifications" element={<OtpVerifications />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App