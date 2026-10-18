const express = require('express');
const mongoose = require('mongoose');
const noteRoutes = require('./routes/NoteRoutes');

// TODO - Update your mongoDB Atals Url here to Connect to the database
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/notes_db";
const PORT = process.env.PORT || 8081;

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', noteRoutes);


app.get('/', (req, res) => {
    res.send("<h1>Welcome to Note taking application - Week06 Exercise</h1>");
});

// Connect to the database
mongoose.connect(DB_URL)
  .then(() => {
    console.log("Successfully connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err.message);
    process.exit(1);
  });
