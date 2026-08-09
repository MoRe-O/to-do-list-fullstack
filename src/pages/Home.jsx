import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar.jsx";
import NoteList from "../components/NoteList.jsx";
import React, {useEffect, useState} from "react";
import ParticleBackground from "../components/ParticleBackground.jsx";
import Popover from "../components/Popover.jsx";

export default function Home({ apiUrl, token }) {

    const [notes, setNotes] = useState([]);
    const [sortBy, setSortBy] = useState("Latest");
    const [popover, setPopover] = useState(false);
    const [searchWord, setSearchWord] = useState("");

    useEffect(() => {
        const fetchNotes = async () => {
            if (token) {
                const res = await getData(apiUrl, token);
                if (res && res.success) {
                    setNotes(res.tasks);
                }
            }
        };
        fetchNotes();
        }, [apiUrl, token]);

    const handleAddTask = async (title, description) => {
        const result = await addTask(apiUrl, token, title, description);
        if (!result || !result.success) {
            return false;
        }
        const res = await getData(apiUrl, token);
        if (res && res.success) {
            setNotes(res.tasks);
        }
        return true;
    }

    const handleDeleteNote = async (id) => {
        setNotes((prevNotes) => prevNotes.filter(note => note.id !== id));
        await deleteTask(apiUrl, token, id);
    }

    const handleCompletedNote = (async (e) => {
        setNotes((prevNotes) => prevNotes.map((note) => note.id === e.target.value ? {...note, isDone: !note.isDone} : note))
        await toggleComplete(apiUrl, token, e.target.value);
    })

    const handleSearch = async (word) => {
        setSearchWord(word);

        const trimmedWord = word ? word.trim() : "";
        if (trimmedWord === "" || trimmedWord === null) {
            const res = await getData(apiUrl, token);
            if (res && res.tasks) {
                setNotes(res.tasks);
            }
        } else {
            const res = await searchTask(apiUrl, token, trimmedWord);
            if (res && res.tasks) {
                setNotes(res.tasks);
            }
        }
    }

    const handleSort = async (sort) => {
        setSortBy(sort);

        const allNotesRes = await getData(apiUrl, token);

        if (!allNotesRes || !allNotesRes.tasks) {
            return;
        }

        let sortedNotes = [...allNotesRes.tasks];

        if (sort === "Completed") {
            const completedRes = await getCompletedTasks(apiUrl, token);
            if (completedRes && completedRes.tasks) {
                setNotes(completedRes.tasks);
            } else {
                setNotes([]);
            }
            return;
        }

        if (sort === "Earliest") {
            sortedNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        } else if (sort === "Latest") {
            sortedNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }

        setNotes(sortedNotes);
    }

    return (
        <div className="flex justify-center">
            <ParticleBackground />
            <Popover isOpen={popover} onClosePopover={() => setPopover(false)} apiUrl={apiUrl} token={token} onAddTask={handleAddTask} />

            <div className="flex flex-col w-[1000px] gap-10 z-10">
                <div className="flex flex-col gap-10">
                    <Header apiUrl={apiUrl} token={token} />
                    <Navbar sortBy={sortBy} onSort={e => handleSort(e.target.value)} onOpenPopover={() => setPopover(true)} onSearch={handleSearch} />
                </div>
                <div className="flex justify-center">
                    <NoteList notes={notes} onDelete={handleDeleteNote} onComplete={handleCompletedNote} sortBy={sortBy} />
                </div>
            </div>
        </div>
    );
}

async function getData(apiUrl, token) {
    try {
        const response = await fetch(apiUrl + "tasks/", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {

            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}

async function toggleComplete(apiUrl, token, id) {
    try {
        const response = await fetch(apiUrl + "tasks/toggle/" + id, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

async function deleteTask(apiUrl, token, id) {
    try {
        const response = await fetch(apiUrl + "tasks/" + id, {
                method: 'DELETE',
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

async function addTask(apiUrl, token, title, description) {
    try {
        const response = await fetch(apiUrl + "tasks/", {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                description: description,
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

async function searchTask(apiUrl, token, searchWord) {
    try {
        const response = await fetch(apiUrl + "tasks/?title=" + searchWord, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {

            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}

async function getCompletedTasks(apiUrl, token) {
    try {
        const response = await fetch(apiUrl + "tasks/?isDone=true", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {

            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}