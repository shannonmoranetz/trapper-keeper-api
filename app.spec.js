import request from 'supertest';
import '@babel/polyfill';
import app from './app';

describe('API', () => {
  let notes;
  beforeEach(() => {
    notes = [
      {title: 'Dylan', 
      noteItems: [{text: 'Is great'}, {text: 'Also Cool'}], 
      id: 1},
      {title: 'Shannon', 
      noteItems: [{text: 'Is amazing'}, {text: 'Also Beautiful'}], 
      id: 2},
      {title: 'Justin', 
      noteItems: [{text: 'Is awesome'}, {text: 'Also stylish'}], 
      id: 3}
    ]
    app.locals.notes = notes
  })

  afterEach(() => {
    notes = [
      {title: 'Dylan', 
      noteItems: [{text: 'Is great'}, {text: 'Also Cool'}], 
      id: 1},
      {title: 'Shannon', 
      noteItems: [{text: 'Is amazing'}, {text: 'Also Beautiful'}], 
      id: 2},
      {title: 'Justin', 
      noteItems: [{text: 'Is awesome'}, {text: 'Also stylish'}], 
      id: 3}
    ]
    app.locals.notes = notes
  })

  describe('get /notes', () => {
    it('should return status 200 and all of the notes', async () => {
      //setup / execution
      const response = await request(app).get('/notes');
      //expectation
      expect(response.status).toBe(200);
      expect(response.body).toEqual(app.locals.notes);
    });
  });

  describe('delete /notes/:id', () => {
    it('should remove the note and send a 204 status code', async () => {
      //setup
      const note = {
        title: 'Justin', 
        noteItems: [{text: 'Is awesome'}, {text: 'Also stylish'}]};
      //execution
      expect(app.locals.notes.length).toEqual(3);
      const response = await request(app).delete('/notes/3')
        .send(note);
      //expectation
      expect(response.status).toBe(204);
      expect(app.locals.notes.length).toEqual(2);
    });

    it('should return a 404 status and error message if note does not exist', async () => {
      //setup
      const note = {
        title: 'Dylan',
        noteItems: [{text: 'Is amaze'}, {text: 'also fantastic'}]
      };
      //execution
      const response = await request(app).delete('/notes/5')
        .send(note);
      //expectation
      expect(response.status).toBe(404);
      expect(response.body).toEqual('Note not found');
    });
  });

  describe('post /notes', () => {
    it('should add a new note, return status 200 and return all notes', async () => {
      //setup
      const newNote = {
        title: 'Christy',
        noteItems: [{text: 'Is a great teacher'}],
        id: 4
      };
      //execution
      const response = await request(app).post('/notes')
        .send(newNote);
      //expectation
      expect(response.status).toBe(200);
      expect(response.body).toEqual(newNote);
    });

    it('should respond with a 422 code and error if there is no id', async () => {
      //setup
      const newNote = {
        title: 'David',
        noteItems: [{text: 'Is a great teacher'}],
      };
      //execution
      const response = await request(app).post('/notes');
      //expectation
      expect(response.status).toBe(422)
      expect(response.body).toEqual('Error posting note')
    });

    it('should respond wth a 409 code and error message if id already exists', async() => {
      //setup
      const duplicateNote = 
      {title: 'Dylan', 
      noteItems: [{text: 'Is great'}, {text: 'Also Cool'}], 
      id: 1}
      //execution
      const response = await request(app).post('/notes').send(duplicateNote);
      //expectation
      expect(response.status).toBe(409)
      expect(response.body).toEqual('Please try adding your note again')
    })
  });

  describe('put /notes/:id', () => {
    it('if id params matches a note id, replace note, send 200 status and return updated note', async () => {
      //setup
      const updatedNote = {title: 'Shannon Moranetz', 
      noteItems: [{text: 'Is Super amazing'}, {text: 'Also Beautiful and kind'}], 
      id: 2}
      const newNotes = [{title: 'Dylan', 
      noteItems: [{text: 'Is great'}, {text: 'Also Cool'}], 
      id: 1},
      {title: 'Shannon Moranetz', 
      noteItems: [{text: 'Is Super amazing'}, {text: 'Also Beautiful and kind'}], 
      id: 2},
      {title: 'Justin', 
      noteItems: [{text: 'Is awesome'}, {text: 'Also stylish'}], 
      id: 3}
    ]
      //execution
      const response = await request(app).put('/notes/2').send(updatedNote);
      //expectation
      expect(app.locals.notes).toEqual(newNotes)
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedNote)
    })

    it('should return status 404 and error if the note is not found', async () => {
      const updatedNote = {title: 'Shannon Moranetz', 
      noteItems: [{text: 'Is Super amazing'}, {text: 'Also Beautiful and kind'}], 
      id: 2}
      //execution
      const response = await request(app).put('/notes/5').send(updatedNote)
      //expectation
      expect(response.status).toBe(404)
      expect(response.body).toEqual('Note not found')
    })
  })
});