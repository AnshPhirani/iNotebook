import React, { useEffect, useContext, useState, useRef } from "react";
import NoteContext from "../context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";

export const Notes = (props) => {
  const context = useContext(NoteContext);
  const { notes, getNotes, editNote } = context;

  const navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem("authToken")){
      // no auth token is found
      navigate("/login");
    }
    else{
      getNotes();
    }
    
    // eslint-disable-next-line
  }, []);

  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "default",
  });
  const refOpen = useRef(null);
  const refClose = useRef(null);

  const updateNote = (currentNote) => {
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
    refOpen.current.click();
  };

  const handleEditNote = (e) => {
    e.preventDefault();
    console.log("updating the note");
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click();
    props.showAlert("Note Updated Successfully", "success");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };



  // handling auto resize of textarea
  const textareaRef = useRef(null);
  useEffect(() => {
    textareaRef.current.style.overflow = "hidden";
    textareaRef.current.style.height = "0px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + "px";
  }, [note]);

  return (
    <>
      <AddNote showAlert = {props.showAlert} />

      <button
        ref={refOpen}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    aria-describedby="emailHelp"
                    minLength={5}
                    onChange={onChange}
                    value={note.etitle}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    ref={textareaRef}
                    type="text"
                    className="form-control"
                    rows={1}
                    style={{ resize: "none" }}
                    id="edescription"
                    name="edescription"
                    minLength={5}
                    onChange={onChange}
                    value={note.edescription}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    name="etag"
                    onChange={onChange}
                    value={note.etag}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                ref={refClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={handleEditNote}
                type="button"
                disabled={
                  note.etitle.length < 5 || note.edescription.length < 5
                }
                className="btn btn-primary"
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container row my-3">
        <h2>Your notes</h2>
        {notes.length === 0 && <h5>No Notes to display</h5>}
        {notes.length !== 0 &&
          notes.map((note) => {
            return (
              <NoteItem key={note["_id"]} updateNote={updateNote} note={note} showAlert={props.showAlert}/>
            );
          })}
      </div>
    </>
  );
};

export default Notes;
