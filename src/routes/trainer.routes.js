const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainer.controller');


const auth  = require('../middlewares/auth.middleware');

router.post('/', auth, trainerController.createTrainer);
router.get('/', auth, trainerController.getTrainer);
router.put('/', auth, trainerController.updateTrainer);
router.delete('/', auth, trainerController.deleteTrainer);

router.post('/mark', auth, trainerController.markPokemon); 

module.exports = router;