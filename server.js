const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');
const notes = require('./db/db.json');
// not sure yet if I need this line below 
const { DH_CHECK_P_NOT_SAFE_PRIME } = require("constants");

// creating an isntance of 'express' application framework - then we assign it to the 'app' variable so we can use it later
const app = express();
// we are setting the PORT variable to 8080 
var PORT = process.env.PORT || 8080;

// Middleware function below! 
// parses incoming URL-encoded payload - adds a 'body' object to the 'request' object - which contains parsed data + extended:true
// parses incoming requests with JSON payloads --> adds a 'body' object to the 'request' object - which contains parsed data
// serves static files from 'public' directory (not too clear to me yet, TBC)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Defining a route for the root URL using the 'app.get' method to handle HTTP GET request to the toor URL - 'res.sendFile(), will return a file to the client 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Defining a route to '/api/notes' endpoint using HTTP POST method
// call back function first reads the JSON file content using 'fs.readFileSync' method - then returns a string, which is parsed into JS thanks to JSON.parse
// the newNote to be added is extracted and assigned a UUID - then added to the 'notes' array, 'notes.push' and written back to the JSON file using 'fs.writeFileSync' 
app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const newNotes = req.body;
    newNotes.id = uuid.v4();
    notes.push(newNotes);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(notes);
});


// This function is using HTTP DELETE Method to handle delete requests to the '/api/notes/:id endpoint 
// when a DELETE request is received for this endpoint, the callback function '(req,res) => {...} is executed 
// the note object to be deleted is identified thanks to the UUID 
app.delete('/api/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const deleteNotes = notes.filter((note) => note.id !== req.params.id);
    fs.writeFileSync('./db/db.json', JSON.stringify(deleteNotes));
    res.json(delNotes);
});

// HTML routing to follow when using app.get 
// routing first to '/index.html' home page - endpoint
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
// routing this calls to '/notes.html' page - endpoint
app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// This function will start the server and follow the configuration to listen to the PORT 8080 which is by default the most commonly used for this kinda app 
app.listen(PORT, function () {
    console.log('App listening on PORT ' + PORT);
});