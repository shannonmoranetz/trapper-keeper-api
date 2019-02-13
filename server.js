import express from 'express';
const app = express();
app.use(express.json());
app.set('port', 3001);
import cors from 'cors';
app.use(cors());

app.locals.notes = [];

app.get('/notes', (req, res) => {
  res.json(app.locals.notes);
});

// We are not sure at this point if we want to use this? 
// app.get('/notes/:id', (req, res) => {
//   const note = app.locals.notes.find((note) => note.id == req.params.id);
//   if (!note) return res.status(404).json('Note not found.');
//   res.status(200).json(note);
// })

app.delete('/notes/:id', (req, res) => {
  const noteIndex = app.locals.notes.findIndex(note => note.id == req.params.id);
  if (noteIndex === -1) return res.status(404).json('Note not found');
  app.locals.notes.splice(noteIndex, 1);
  return res.status(204).send('Note deleted');
})

app.post('/notes', (req, res) => {
  const { id, title, noteItems } = req.body;
  if (!id) return res.status(422).send('Error posting note.');
  const isduplicate = app.locals.notes.some(note => note.id == req.params.id)
  if (isduplicate) return res.status(409).send('Please try adding your note again')
  const newNote = {
    title,
    id,
    noteItems
  }
  app.locals.notes.push(newNote);
  res.status(200).json(app.locals.notes);
});

app.listen(app.get('port'), () => {
  console.log(`App is running on port: ${app.get('port')}`)
});