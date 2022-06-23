import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];

  const [notes, setNotes] = useState(notesInitial);

  // Get all notes
  const getNotes = async () => {
    // API call
    // eslint-disable-next-line
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("authToken") ,
      }
    });

    const allNotes = await response.json();
    console.log(allNotes);

    setNotes(allNotes);
  };


  // Add a note
  const addNote = async (title, description, tag) => {
    // API call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("authToken") ,
      },
      body: JSON.stringify({title, description, tag}),
    });

    const note = await response.json();
    console.log("new note added successfully");
    setNotes(notes.concat(note));
  };

  // Delete a note
  const deleteNote = async (id) => {
    // API call
    // eslint-disable-next-line
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("authToken") ,
      },
    });
    // const json = await response.json();
    console.log("deleting the note with id " + id);
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
  };
  // edit a note
  const editNote = async (id, title, description, tag) => {
    // API call
    // eslint-disable-next-line
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("authToken") ,
      },
      body: JSON.stringify({title, description, tag}),
    });
    // const json = await response.json();
    console.log("updating the note with id " + id);
    // Logic to edit in client
    let updatedNotes = JSON.parse(JSON.stringify(notes)); // creating deep copy
    for (let idx = 0; idx < updatedNotes.length; idx++) {
      if (updatedNotes[idx]._id === id) {
        updatedNotes[idx].title = title;
        updatedNotes[idx].description = description;
        updatedNotes[idx].tag = tag;
        break;
      }
    }
    setNotes(updatedNotes);
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes}}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
