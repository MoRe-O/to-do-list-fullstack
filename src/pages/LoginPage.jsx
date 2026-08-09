import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../components/Input.jsx";
import ConfirmButton from "../components/ConfirmButton";
import ParticleBackground from "../components/ParticleBackground";
import "./LoginPage.css";

export default function LoginPage({ apiUrl }) {

    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (location.state?.phone) {
            setEmail(location.state.phone);
            inputRef.current?.focus();
        }
    }, [location.state]);

    const handleConfirm = async () => {
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }

        const result = await postData(apiUrl, email);
        if (!result || !result.success) {
            toast.error(result?.message || "Could not send a verification code. Please try again.");
            return;
        }

        navigate("/otp", { state: { email: email } });
    };

    return (
        <div className="flex w-full justify-center items-center h-screen gap-3">
            <ParticleBackground />
            <div className="login-card">
                <h1>Login / Sign Up</h1>
                <p className="login-subtitle">Enter your email — new here or returning, we'll send you a code.</p>
                <Input value={email} onChange={setEmail} inputRef={inputRef} name="email" />
                <ConfirmButton onClick={handleConfirm} />
            </div>
        </div>
    );
}

async function postData(apiUrl, email) {
    try {
        const response = await fetch(apiUrl + "users/send-otp", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, message: result?.message };
        }

        return result;
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, message: "Could not reach the server." };
    }
}
