const express = require('express');
const router = express.Router();
const pkmnController = require('../controllers/pkmn.controller');

router.get('/types', pkmnController.getTypes);

module.exports = router;