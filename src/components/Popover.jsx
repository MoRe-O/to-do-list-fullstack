import React, {useRef, useState} from "react";
import Input from "./Input.jsx";
import {toast} from "react-toastify";


export default function Popover({ isOpen, onClosePopover, onAddTask }) {

    const [title, setTitle] = useState("");
    const inputRef = useRef(null);
    const [description, setDescription] = useState("");

    if (!isOpen) return null;



    const handlePostData = async () => {
        if (!title.trim()) {
            toast.error("Please enter a title.");
            return;
        }

        const success = await onAddTask(title, description);

        if (success) {
            setTitle("");
            setDescription("");
            onClosePopover();
        } else {
            toast.error("Could not add the note. Please try again.");
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-screen z-20 border border-white/20 backdrop-blur-md bg-white/10">
            <div
                className="flex flex-col border border-white/60 backdrop-blur-md bg-white/40 min-w-[20%] rounded-2xl justify-center text-center gap-5 p-5 z-20"
            >
                <h3 className="text-3xl font-bold">Add Note</h3>
                <Input value={title} onChange={setTitle} inputRef={inputRef} name="Title" />
                <Input value={description} onChange={setDescription} inputRef={inputRef} name="Description" />

                <button className="w-full p-3 rounded-2xl border border-prpl/80 backdrop-blur-md bg-prpl/70"
                    onClick={handlePostData}
                >
                    Add
                </button>
                <button className="w-full p-3 rounded-2xl border border-red-600/80 backdrop-blur-md bg-red-600/70"
                    onClick={onClosePopover}
                >
                    Close
                </button>
            </div>
        </div>

    );
}
