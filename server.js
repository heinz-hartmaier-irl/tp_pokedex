const app = require('./app'); 
const apiRouter = require('./src/routes');

const port = 3000;

// Préfixe /api pour toute les routes futures
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`HTTP server running at http://localhost:${port}`);
});