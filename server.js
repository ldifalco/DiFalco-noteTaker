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


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});


app.get('/api/notes', (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    const notesArray = JSON.parse(data);
    res.json(notesArray);
  });
});


app.post('/api/notes', (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    };
  
    const notesArray = JSON.parse(data);

    const { title, text } = req.body;
    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuidv4()
      };
   
      notesArray.push(newNote);
      fs.writeFile(`./db/db.json`, JSON.stringify(notesArray), (err) =>
        err
          ? console.error(err)
          : console.log(
            `New note ${newNote.title} has been saved!`
          )
      );
      res.json(newNote);
    }
  });
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🎧`));