import React from "react";
import "./components.css";

export default function ConfirmButton({ onClick }) {
    return (
        <button onClick={onClick} className="confirm-button">
            Confirm
        </button>
    );
}
