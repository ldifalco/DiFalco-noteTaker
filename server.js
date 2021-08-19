//require keyword for using file system, npm packages https://www.npmjs.com/package/uuid, and express.
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
//get requests for notes.html

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

//Parses json file
app.get('/api/notes', (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    const notesAdded = JSON.parse(data);
    res.json(notesAdded);
  });
});

//posts new note into db.json, uses uuid to generate ids for new additions
app.post('/api/notes', (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    };
  
    const notesAdded = JSON.parse(data);

    const { title, text } = req.body;
    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuidv4()
      };
   //writes new notes into db.json
      notesAdded.push(newNote);
      fs.writeFile(`./db/db.json`, JSON.stringify(notesAdded), (err) =>
        err
          ? console.error(err)
          : console.log(
        
      ));
      res.json(newNote);
    }
  });
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🎧`));