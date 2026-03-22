import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default to login page for this demo, or redirect as needed */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
