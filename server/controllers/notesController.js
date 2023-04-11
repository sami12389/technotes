const Note = require("../models/Note")
const User = require("../models/User")
const asyncHandler = require("express-async-handler")

//Get notes
//Route GET/note
//Access private
const getNotes = asyncHandler(async(req, res, next)=>{
    const notes = await Note.find().lean()
    if(!notes?.length){
        return res.status(400).json({message: "No notes found."})
    }
    //Add username to notes before sending the response
    const notesWithUser = await Promise.all(notes.map(async(note)=>{
        const user = await User.findById(note.user).lean().exec()
        return {...note, username: user.username}
    }))
    res.json(notesWithUser)
})


//Create note
//Route POST/note
//Access private
const createNote = asyncHandler(async(req, res, next)=>{
    const {user, title, text} = req.body
    //Verify data
    if(!user || !title || !text){
       return res.status(400).json({message: "All fields required"})
    }
   //Check for duplicates
   const duplicate = await Note.findOne({title}).lean().exec()
   if(duplicate){
    return res.status(409).json({message: "Duplicate note title."})
   }
   //Create and store the new note
   const note = await Note.create({
    user, title, text
   })
   if(note){
    return res.status(201).json({message: "New note created."})
   }else{
    return res.status(400).json({message: "Invalid note data received."})
   }
})

//Update notes
//Route PATCH/note
//Access private
const updateNote = asyncHandler(async(req, res, next)=>{
    const {_id} = req.body
    if(!_id){
        res.status(400).json("ID required.")
    }
})

//Delete notes
//Route DELETE/note
//Access private
const deleteNote = asyncHandler(async(req, res, next)=>{
    const {_id} = req.body;
})


module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
}