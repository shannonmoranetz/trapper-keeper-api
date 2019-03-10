// import app file since server is the default file 
import app from './app';
// set the port to 3001
app.set('port', 3001);

// listen for changes on port 3001
app.listen(app.get('port'), () => {
  // display a message for the user regarding which port is being listened to (3001)
  console.log(`App is running on port: ${app.get('port')}`)
});