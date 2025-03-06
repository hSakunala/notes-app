import React, { useEffect, useState } from "react";
import "./App.css"
import { eventNames } from "process";
import { json } from "stream/consumers";

type Note = {
    id: number,
    title: string,
    content: string
}

const App = () => {
    const [notes, setNotes] = useState<Note[]>([]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [selectedNote, setSelectedNote] =
        useState<Note | null>(null);

    // put the async func in its own function becuase 
    // react doesnt like the useEffect being async
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                // get fetch is an automatic get request from server
                const response =
                    await fetch("http://localhost:5000/api/notes");
                // convert the data to json and put the date in a note type array
                const notes: Note[] = await response.json();
                setNotes(notes);
            } catch (e) {
                console.log(e)
            };
        };
        // call the function to use the fetch and get data
        fetchNotes();
    }, []); // add dependency array 

    const handleNoteClick = (note: Note) => {
        setSelectedNote(note);
        setTitle(note.title);
        setContent(note.content);
    };


    const handleAddNote = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        // fetch data and use post to add new note to db
        try {
            const response = await fetch(
                "http://localhost:5000/api/notes",
                {
                    method: "POST",
                    headers: {   // have to specify the data we are sending is 
                        // json through header content type
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title,
                        content
                    })
                }
            );

            const newNote = await response.json();

            setNotes([newNote, ...notes]);
            setTitle("");
            setContent("");
        } catch (e) {
            console.log(e);
        };


    };


    const handleUpdateNote = (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedNote) {
            return;
        }

        const updatedNote: Note = {
            id: selectedNote.id,
            title: title,
            content: content,
        }

        // as the map funciton iterates over the notes
        // it will check to see if the iterated note is the one the user selected
        // then it will return the updatedNote, else it will return the original note
        const updatedNotesList = notes.map((note) =>
            note.id === selectedNote.id
                ? updatedNote
                : note
        )

        setNotes(updatedNotesList)
        setTitle("")
        setContent("")
        setSelectedNote(null);
    };


    const handleCancel = () => {
        setTitle("")
        setContent("")
        setSelectedNote(null);
    };

    // function takes in the event(click the x button) and noteID
    const deleteNote = (
        event: React.MouseEvent,
        noteId: number
    ) => {
        // this stopPropagation stops the onClick event in notes item
        event.stopPropagation();

        // returns all the notes except the one selected for deletion
        const updatedNotes = notes.filter(
            (note) => note.id !== noteId
        )

        setNotes(updatedNotes);
    };


    return (
        <div className="app-container">
            <form
                className="note-form"
                onSubmit={(event) =>
                    selectedNote
                        ? handleUpdateNote(event)
                        : handleAddNote(event)
                }
            >
                <input
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                    placeholder="Title"
                    required
                ></input>
                <textarea
                    value={content}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                    placeholder="content"
                    rows={10}
                    required
                ></textarea>
                {/* conditional to see which buttons to show based on
                if a previos not is selected or not */}
                {selectedNote ? (
                    <div className="edit-buttons">
                        <button type="submit">Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                ) : (
                    <button type="submit">Add Note</button>
                )}
            </form>
            <div className="notes-grid">
                {notes.map((note) => (
                    <div
                        className="note-item"
                        onClick={() => handleNoteClick(note)}
                    >
                        <div className="notes-header">
                            <button
                                onClick={(event) =>
                                    deleteNote(event, note.id)
                                }
                            >
                                x
                            </button>
                        </div>
                        <h2>{note.title}</h2>
                        <p>{note.content}</p>
                    </div>
                ))}
            </div>
        </div>);
};

export default App;