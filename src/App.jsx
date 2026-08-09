import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home.jsx";
import OTPPage from "./pages/OTPPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import {useState} from "react";

export default function App() {

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3003/"
    const [token, setToken] = useState(getTokenFromLocalStorage);

    const handleSetToken = (newToken) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem('authToken', JSON.stringify(newToken));
        } else {
            localStorage.removeItem('authToken');
        }
    };
    return (
        <Router>
            <ToastContainer theme="dark" position="top-center" />
            <Routes>
                <Route path="/home" element={<Home apiUrl={apiUrl} token={token} />} />
                <Route path="/" element={<LoginPage apiUrl={apiUrl} />} />
                <Route path="/otp" element={<OTPPage apiUrl={apiUrl} onSetToken={handleSetToken} />} />
            </Routes>
        </Router>
    );
}


const getTokenFromLocalStorage = () => {
    try {
        const token = localStorage.getItem('authToken');
        return token ? JSON.parse(token) : null;
    } catch (error) {
        console.error("Error reading token from localStorage:", error);
        return null;
    }
};
