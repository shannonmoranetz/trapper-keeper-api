// express framework for handling http requests
import express from 'express';
// express middleware to enable cors
import cors from 'cors';
// create app with express framework
const app = express()
// use middleware to parse jsopn
app.use(express.json())
// use middleware to handle requests that use cors
app.use(cors());

// declare notes as an empty array, on app.locals (which persists through app life)
app.locals.notes = [];

// GET method request to notes endpoint
app.get('/notes', (req, res) => {
  // set response status code to 200 (success) and json the notes array
  res.status(200).json(app.locals.notes);
});

// DELETE method request to notes:/id dynamic endpoint
app.delete('/notes/:id', (req, res) => {
  // check against each note's id and the request params (appended url value) if the note exists
  const noteIndex = app.locals.notes.findIndex(note => note.id == req.params.id);
  // if it does not exist, then return a 404 status code and a json error with a string
  if (noteIndex === -1) return res.status(404).json('Note not found');
  // remove the note from the array 
  app.locals.notes.splice(noteIndex, 1);
  // send a successful status code with no body
  return res.sendStatus(204);
});

// POST method request to note endpoint
app.post('/notes', (req, res) => {
  // destructure items from the request body
  const { id, title, noteItems } = req.body;
  // check for duplicate note ids
  const isduplicate = app.locals.notes.some(note => note.id == id)
  // if the note does not have an id, set the status code to 422 (unprocessable entity) and return a json error with a string
  if (!id) return res.status(422).json('Error posting note')
  // if the note id is a duplicate, set the status code to 422 (request conflict) and return a json error with a string
  if (isduplicate) return res.status(409).json('Please try adding your note again')
  // otherwise, create the new note with the following values
  const newNote = {
    title,
    id,
    noteItems
  }
  // push the new note into the notes array
  app.locals.notes.push(newNote);
  // send a status code of 200 (success) and json the new note object
  res.status(200).json(newNote);
});

// PUT method request to to notes:/id dynamic endpoint
app.put('/notes/:id', (req, res) => {
  // destructure id from the request params (appended url value)
  const {id} = req.params
  // set the note object to the request body
  const note = req.body
  // check if the note id exists in the notes array
  const noteIndex = app.locals.notes.findIndex(note => note.id == id)
  // if it does not exist, return a status code of 404 (not found) and return a json error with a string
  if(noteIndex === -1) return res.status(404).json('Note not found')
  // remove the old note via splice and replace with the updated note
  app.locals.notes.splice(noteIndex, 1, note)
  // return a status code 200 (success) and json the updated note
  return res.status(200).json(app.locals.notes[noteIndex])
})

export default app;