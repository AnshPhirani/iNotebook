const express = require("express");
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const { scryRenderedComponentsWithType } = require("react-dom/test-utils");

const router = express.Router();

// ROUTE 1 : Get all the Notes using : GET "/api/notes/fetchallnotes" : Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({user : req.user.id});
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// ROUTE 2 : Add a new Note using : POST "/api/notes/addnote" : Login required
router.post("/addnote", fetchuser, [
    body("title", "Enter a valid Title").isLength({min : 3}),
    body("description", "Enter a valid Description").isLength({ min: 1 }),
], async (req, res) => {

    // if there are errors return Bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {title, description, tag} = req.body;
        const note = new Note({
            title,
            description,
            tag,
            user : req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
    
})


// ROUTE 3 : Update a existing Note using : PUT "/api/notes/updatenote" : Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {

    try {
        const {title, description, tag} = req.body;
        // Create a newNote objrct
        const newNote = {};
        if(title) {newNote.title = title};
        if(description) {newNote.description = description};
        if(tag) {newNote.tag = tag};

        // find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not found");
        }
        if(note.user.toString() != req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.json(note);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
    
})


// ROUTE 4 : Delete a existing Note using : DELETE "/api/notes/deletenote" : Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {

    try {
        // find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not found");
        }

        // Allow deletion only if this user owns the note
        if(note.user.toString() != req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({success : "Note has been deleted", note});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
    
})

module.exports = router;
