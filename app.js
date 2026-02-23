const express = require('express');
const mongoose = require('mongoose');
const helmet = require("helmet")
const pkmnRoutes = require('./src/routes/pkmn.routes.js');
const authRouter = require('./src/routes/authRouter');
require('dotenv').config({ path: './props.env' });

const app = express();


//protection des headers de l'app
app.use(helmet())

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.use('/pkmn', pkmnRoutes);
app.use('/auth', authRouter);


// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/td')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log(err));

//Route de base pour tester le serveur
app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;