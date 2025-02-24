import "./App.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import OtpVerification from "./pages/OtpVerification";
import Home from "./pages/Home";
import Qrcodescan from "./pages/Qrcodescan";
import RunningJob from "./pages/RunningJob";
import Profile from "./pages/Profile";
import Reward from "./pages/Reward";
import History from "./pages/History";
import Notification from "./pages/Notification";
import HubList from "./pages/HubList";
import PaymentPage from "./pages/PaymentPage";
import PaymentDetail from "./pages/PaymentDetail";

function App() {
  const [isToken, setIsToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("qkwashtoken");
    setIsToken(!!token);
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        {isToken !== null && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/qrcode-scanner" element={<Qrcodescan />} />
            <Route path="/hub-details" element={<HubList />} />
            <Route path="/running-jobs" element={<RunningJob />} />
            <Route path="/history" element={<History />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-detail" element={<PaymentDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reward" element={<Reward />} />
            <Route path="/notification" element={<Notification />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
