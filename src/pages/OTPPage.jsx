import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmButton from "../components/ConfirmButton";
import ParticleBackground from "../components/ParticleBackground";
import "./OTPPage.css";

export default function OTPPage({ apiUrl, onSetToken }) {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const numFields = 6;
    const [otp, setOtp] = useState(new Array(numFields).fill(""));
    const inputsRef = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < numFields - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleFocus = () => {
        const firstEmpty = otp.findIndex((val) => val === "");
        if (firstEmpty !== -1) {
            inputsRef.current[firstEmpty].focus();
        } else {
            inputsRef.current[numFields - 1].focus();
        }
    };

    const handleSubmit = async () => {
        const code = otp.join("");
        if (code.length < numFields) {
            toast.error("Please enter the full code");
            return;
        }
        const res = await postData(apiUrl, email, code);
        if (res && res.success) {
            onSetToken(res.token);
            navigate("/home");
        } else {
            toast.error(res?.message || "Could not verify the code. Please try again.");
        }
    };

    const handleEditPhone = () => {
        navigate("/", { state: { phone: email } });
    };

    return (
        <div className="otp-page">
            <ParticleBackground /> {/* ✅ animated background */}
            <div className="otp-card">
                <div className="otp-header">
                    <span>Is this your email? {email}</span>
                    <button onClick={handleEditPhone} className="edit-phone-button">
                        Edit
                    </button>
                </div>
                <h1>Enter Confirmation Code</h1>
                <div className="otp-inputs" onClick={handleFocus}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={(el) => (inputsRef.current[index] = el)}
                        />
                    ))}
                </div>
                <ConfirmButton onClick={handleSubmit} />
            </div>
        </div>
    );
}

async function postData(apiUrl, email, code) {
    try {
        const response = await fetch(apiUrl + "users/verify-otp", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                code: code
            })
        });

        return await response.json();
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: "Could not reach the server." };
    }
}
