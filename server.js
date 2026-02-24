const app = require('./app'); 
const apiRouter = require('./src/routes');
require('./websocketserver');

const port = 3000;

// Préfixe /api pour toute les routes futures
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`HTTP server running at http://localhost:${port}`);
  console.log(`WebSocket available on ws://localhost:8181`);
});