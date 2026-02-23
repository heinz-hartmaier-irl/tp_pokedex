const express = require('express');
const router = express.Router();
const pkmnController = require('../controllers/pkmn.controller');

const auth  = require('../middlewares/auth.middleware');
const { hasPermission } = require('../middlewares/perm.middleware');
const { permissions } = require('../config/permissions');

//Pour les types
router.get('/types', pkmnController.getTypes);

//Consulter les pokemons, accessible à tous
router.get('/', pkmnController.getAll);

//Routes reservé à un Admin
router.post(
  '/',
  auth,
  hasPermission(permissions.CAN_CREATE_PKMN),
  pkmnController.createPokemon
);

//Routes accessible au User et à l'Admin
router.post(
  '/:id/tag',
  auth,
  hasPermission(permissions.CAN_TAG_PKMN),
  pkmnController.tagPokemon
);

module.exports = router;