const express = require('express');
const fs = require('fs');
const path = require('path');
const notes = require('./db/db.json');

// creating an isntance of 'express' application framework - then we assign it to the 'app' variable so we can use it later
const app = express();
// we are setting the PORT variable to 8080 
var PORT = process.env.PORT || 8080;

// this runs the Date.now and generates a timestamp ID that I'll use to DELETE notes (thanks to the id alocated to each note)
function uuid() {
    return Date.now();
}

// Middleware function below! 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const root = path.join(__dirname, './public');
app.use(express.static(root));

//Defining a route to '/api/notes' endpoint using HTTP GET method
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json(notes);
});

//Defining a route to '/api/notes' endpoint using HTTP POST method
app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const newNotes = req.body;
    newNotes.id = uuid();
    notes.push(newNotes);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(notes);
});


// This function is using HTTP DELETE Method to handle delete requests to the '/api/notes/:id endpoint 
app.delete('/api/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const deleteNotes = notes.filter((note) => parseInt(note.id) !== parseInt(req.params.id));
    fs.writeFileSync('./db/db.json', JSON.stringify(deleteNotes));
    res.json(deleteNotes);
});

// HTML routing 
// Sets routing to 'index.html' as the home page
app.get('/', (req, res) => {
    res.sendFile('index.html', {root});
});

// Sets routing to 'notes.html' as the endpoint when wanting to add notes 
app.get('/notes', function (req, res) {
    res.sendFile('notes.html', {root});
});

// This function will start the server and follow the configuration to listen to the PORT 8080 which is by default the most commonly used for this kinda app 
app.listen(PORT, function () {
    console.log(`App listening at http://localhost:${PORT}`);
});
