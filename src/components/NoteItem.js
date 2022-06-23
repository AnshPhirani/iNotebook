import React, {useContext} from "react";
import NoteContext from "../context/notes/noteContext";

export const NoteItem = (props) => {
  const { note , updateNote} = props;
  const context = useContext(NoteContext);
  const {deleteNote} = context;

  const handleDeleteNote = () => {
    deleteNote(note._id);
    props.showAlert("Note Deleted Successfully", "success");
  }

  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">{note.description}</p>
          <div className="d-flex justify-content-between">
            <p style={{ fontSize: "0.9rem" }}>Created on 28/11/2001</p>
            <div className="d-flex justify-content-end">
              <i className="fa-regular fa-trash-can mx-4" onClick={handleDeleteNote}></i>
              <i className="fa-regular fa-pen-to-square" onClick={()=>{updateNote(note)}}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
