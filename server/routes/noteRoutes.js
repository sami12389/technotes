const express = require("express")
const noteControllers = require("../controllers/notesController")
const router = express.Router()

router.route("/")
.get(noteControllers.getNotes)
.post(noteControllers.createNote)
.patch(noteControllers.updateNote)
.delete(noteControllers.deleteNote)

module.exports = router;