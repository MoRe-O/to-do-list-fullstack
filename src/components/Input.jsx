import React from "react";
import "./components.css";

export default function Input({ value, onChange, inputRef, name }) {
    return (
        <div className="phone-input floating-label">
            <input
                id="input"
                type="field"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder=" "
                ref={inputRef}
            />
            <label htmlFor="input">{name}</label>
        </div>
    );
}
