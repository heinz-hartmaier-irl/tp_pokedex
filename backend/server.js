const app = require('./app');


const mongoose = require("mongoose");
require('dotenv').config({ path: './props.env' });

const port = 3000;

//Connexion MongoDb
mongoose.connect('mongodb://127.0.0.1:27017/td')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log(err));


// ⚠️ Ne démarre pas le serveur pendant les tests
if (process.env.NODE_ENV !== 'test') {
  require('./websocketserver');

  app.listen(port, () => {
    console.log(`HTTP server running at http://localhost:${port}`);
    console.log(`WebSocket available on ws://localhost:8181`);
  });
}