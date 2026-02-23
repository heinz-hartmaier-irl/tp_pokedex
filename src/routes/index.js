const express = require('express');
const router = express.Router();

const pkmnRoutes = require('./pkmn.routes');

router.use('/pkmn', pkmnRoutes);

module.exports = router;