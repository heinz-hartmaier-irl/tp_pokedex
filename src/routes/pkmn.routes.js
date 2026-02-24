const express = require('express');
const router = express.Router();
const pkmnController = require('../controllers/pkmn.controller');

const auth  = require('../middlewares/auth.middleware');
const { hasPermission } = require('../middlewares/perm.middleware');
const { permissions } = require('../config/permissions');


//Obtenir tout les types (phase de test)
router.get('/types', pkmnController.getTypes);

//Obtenir une liste de tout les pokemons
router.get('/', pkmnController.getAll);

//Recherche de X Pokemon (Authentification nécessaire)
router.get('/search', auth, pkmnController.search);

//Route Réserver à un Admin
router.post(
  '/',
  auth,
  hasPermission(permissions.CAN_CREATE_PKMN),
  pkmnController.createPokemon
);

router.post(
  '/region',
  auth,
  hasPermission(permissions.CAN_CREATE_PKMN),
  //  (req, res, next) => {
  // console.log("La route existe l'erreur 404 vient d'ailleurs");
  // next();
  // },
  pkmnController.addRegion
);

router.delete(
  '/region',
  auth,
  hasPermission(permissions.CAN_DELETE_PKMN),
  pkmnController.deleteRegion
);

router.put(
  '/:id',
  auth,
  hasPermission(permissions.CAN_EDIT_PKMN),
  pkmnController.updatePokemon
);

router.delete(
  '/:id',
  auth,
  hasPermission(permissions.CAN_DELETE_PKMN),
  pkmnController.deletePokemon
);


//Route lié à l'utilisateur lui même donc permissions partagé ? pas encore très cohérent.
router.post(
  '/:id/tag',
  auth,
  hasPermission(permissions.CAN_TAG_PKMN),
  pkmnController.tagPokemon
);

module.exports = router;