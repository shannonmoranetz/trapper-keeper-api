import express from 'express';
import cors from 'cors';
const app = express()
app.use(express.json())
app.use(cors());

app.locals.notes = [];

app.get('/notes', (req, res) => {
  res.status(200).json(app.locals.notes);
});

app.delete('/notes/:id', (req, res) => {
  const noteIndex = app.locals.notes.findIndex(note => note.id == req.params.id);
  if (noteIndex === -1) return res.status(404).json('Note not found');
  app.locals.notes.splice(noteIndex, 1);
  return res.sendStatus(204);
});

app.post('/notes', (req, res) => {
  const { id, title, noteItems } = req.body;
  const isduplicate = app.locals.notes.some(note => note.id == id)
  if (!id) return res.status(422).json('Error posting note');
  if (isduplicate) return res.status(409).json('Please try adding your note again')
  const newNote = {
    title,
    id,
    noteItems
  }
  app.locals.notes.push(newNote);
  res.status(200).json(newNote);
});

app.put('/notes/:id', (req, res) => {
  const {id} = req.params
  const note = req.body
  const noteIndex = app.locals.notes.findIndex(note => note.id == id)
  if(noteIndex === -1) return res.status(404).json('Note not found')
  app.locals.notes.splice(noteIndex, 1, note)
  return res.status(200).json(app.locals.notes[noteIndex])
})

export default app;