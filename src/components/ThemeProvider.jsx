import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") setDark(true);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (dark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    const toggleTheme = () => setDark((prev) => !prev);

    return (
        <ThemeContext.Provider value={{ dark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
