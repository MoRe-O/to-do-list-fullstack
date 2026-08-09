import {useEffect, useState} from "react";

export default function Header({apiUrl, token}) {

    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchEmail = async () => {
            const res = await getData(apiUrl, token);
            if (res && res.success) {
                setEmail(res.email);
            }
        };
        if (token) {
            fetchEmail();
        }
    }, [apiUrl, token]);


    return (
        <div className="grid grid-cols-3 w-full mt-10 items-end">
            <div className="">
                <p className="font-bold text-transparent bg-clip-text backdrop-blur-md bg-white/20">
                    {email || "Loading..."}
                </p>
            </div>
            <div className="rounded-2xl">
                <h1 className="text-center text-5xl font-extrabold text-transparent bg-clip-text bg-white/30 backdrop-blur-lg">TO-DO
                    LIST</h1>
            </div>
        </div>
    );
}

async function getData(apiUrl, token) {
    try {
        const response = await fetch(apiUrl + "users/", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user:", error.message);
        return null;
    }
}
