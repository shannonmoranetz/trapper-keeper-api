import express from 'express';
const app = express();
app.set('port', 3001);

app.get('/', (req, res) => {
  res.send('hello shannon!🐶')
})

app.listen(app.get('port'), () => {
  console.log(`App is running on port: ${app.get('port')}`)
})