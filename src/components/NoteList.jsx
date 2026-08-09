export default function NoteList({ notes, onDelete, onComplete }) {

    if (!notes.length) {
        return <h2 className="font-bold text-transparent bg-clip-text backdrop-blur-md bg-white/20 mb-10">No note here</h2>;
    }


    return (
        <div className="flex flex-col w-[80%] gap-5 transition">
            {
                notes.map((note) => (
                    <NoteItem key={note.id} note={note} onDelete={onDelete} onComplete={onComplete} />
                ))
            }
        </div>
    );
}

export function NoteItem({ note, onDelete, onComplete }) {

    const options = {
        year: "numeric",
        month: "long",
        day: "numeric"
    }

    return (
        <div className={`flex items-center p-5 gap-5 rounded-2xl hover:scale-105 transition border border-white/20 backdrop-blur-md ${note.isDone ? "bg-white/5 opacity-60" : "bg-white/10"}`}>
            <input
                type="checkbox"
                name={note.name}
                id={note.id}
                value={note.id}
                checked={note.isDone}
                onChange={onComplete}
                className="accent-prpl w-[26px] h-[26px] border-2 border-prpl rounded-[2px] checked:bg-prpl transition duration-200 cursor-pointer"
            />
            <div className="flex flex-col w-full">
                <div className="flex flex-row">
                    <div className="flex flex-col grow">
                        <p className={`text-2xl font-bold ${note.isDone ? "line-through text-gray-400" : ""}`}>{note.title}</p>
                        <p className={`w-full grow-0 ${note.isDone ? "line-through text-gray-500" : ""}`}>{note.description}</p>
                    </div>
                    <button
                        onClick={() => onDelete(note.id)}
                        className="cursor-pointer text-gray-400 hover:text-red-500"
                    >
                        <svg width="25" height="25" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z" stroke="currentColor"/>
                            <path d="M14.625 3.75H3.375" stroke="currentColor" strokeLinecap="round"/>
                            <path d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z" stroke="currentColor"/>
                            <path d="M10.5 9V12.75" stroke="currentColor" strokeLinecap="round"/>
                            <path d="M7.5 9V12.75" stroke="currentColor" strokeLinecap="round"/>
                        </svg>

                    </button>
                </div>
                <div className="flex grow border-t-[1px] border-gray-500 mt-3 text-gray-400">
                    {new Date(note.createdAt).toLocaleDateString("en-US", options)}
                </div>
            </div>
        </div>
    );
}


