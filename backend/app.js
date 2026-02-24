const express = require('express');
const mongoose = require('mongoose');
const helmet = require("helmet")
const pkmnRoutes = require('./src/routes/pkmn.routes.js');
const authRouter = require('./src/routes/authRouter');
const trainerRouter = require('./src/routes/trainer.routes.js')
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const apiRouter = require('./src/routes');

require('dotenv').config({ path: './props.env' });

const app = express();


//protection des headers de l'app
app.use(helmet())


// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Préfixe /api pour toute les routes futures
app.use('/api', apiRouter);

//Routes
app.use('/pkmn', pkmnRoutes);
app.use('/auth', authRouter);
app.use('/trainer', trainerRouter);

// Connexion à MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/td')
//   .then(() => console.log('Connexion à MongoDB réussie !'))
//   .catch((err) => console.log(err));

//Route de base pour tester le serveur
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "MMI Express API with Swagger",
      version: "0.1.0",
      description: "TP de NodeJS. Apprentissage 05",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Author",
        url: "https://google.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js"], 
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

module.exports = app;