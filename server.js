import express from 'express';
const app = express();
app.use(express.json());
app.set('port', 3001);

app.locals.notes = [];

app.get('/notes', (req, res) => {
  res.json(app.locals.notes);
});

app.get('/notes/:id', (req, res) => {
  const note = app.locals.notes.find((note) => note.id == req.params.id);
  if (!note) return res.status(404).json('Note not found.');
  res.status(200).json(note);
})

app.delete('/notes/:id', (req, res) => {
  const newNotes = app.locals.notes.filter((note) => note.id != req.params.id);
  // sad path? 
  app.locals.notes = newNotes;
  res.status(204).json(`Note successfully deleted.`);
  // review above
})

app.post('/notes', (req, res) => {
  const { id, title, list } = req.body;
  if (!id) return res.status(422).send('Error posting note.');
  // check if id exists too
  const newNote = {
    title,
    id,
    list
  }
  app.locals.notes.push(newNote);
  res.status(200).json(app.locals.notes);
});

app.listen(app.get('port'), () => {
  console.log(`App is running on port: ${app.get('port')}`)
});