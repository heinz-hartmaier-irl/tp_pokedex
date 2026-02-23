const express = require('express');
const mongoose = require('mongoose');
const helmet = require("helmet")

const app = express();


//protection des headers de l'app
app.use(helmet())

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/td')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;