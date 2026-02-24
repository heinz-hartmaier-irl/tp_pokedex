const express = require('express');
const router = express.Router();
const pkmnController = require('../controllers/pkmn.controller');

const auth  = require('../middlewares/auth.middleware');
const { hasPermission } = require('../middlewares/perm.middleware');
const { permissions } = require('../config/permissions');

/**
 * @swagger
 * tags:
 *   name: Pokemon
 *   description: Gestion des Pokémon
 */

/**
 * @swagger
 * /pkmn/types:
 *   get:
 *     summary: Récupère tous les types de Pokémon
 *     tags: [Pokemon]
 *     responses:
 *       200:
 *         description: Liste des types de Pokémon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 */
//Obtenir tout les types (phase de test)
router.get('/types', pkmnController.getTypes);

/**
 * @swagger
 * /pkmn:
 *   get:
 *     summary: Récupère tous les Pokémon
 *     tags: [Pokemon]
 *     responses:
 *       200:
 *         description: Liste des Pokémon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pokemon'
 */
//Obtenir une liste de tout les pokemons
router.get('/', pkmnController.getAll);

/**
 * @swagger
 * /pkmn/search:
 *   get:
 *     summary: Recherche des Pokémon selon plusieurs critères
 *     tags: [Pokemon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page à afficher
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: Nombre de Pokémon par page
 *       - in: query
 *         name: typeOne
 *         schema:
 *           type: string
 *         description: Filtrer par type principal
 *       - in: query
 *         name: typeTwo
 *         schema:
 *           type: string
 *         description: Filtrer par type secondaire
 *       - in: query
 *         name: partialName
 *         schema:
 *           type: string
 *         description: Recherche par nom partiel
 *     responses:
 *       200:
 *         description: Liste filtrée des Pokémon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pokemon'
 */
//Recherche de X Pokemon (Authentification nécessaire)
router.get('/search', auth, pkmnController.search);

//Route Réserver à un Admin

/**
 * @swagger
 * /pkmn:
 *   post:
 *     summary: Crée un nouveau Pokémon
 *     tags: [Pokemon]
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               types:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *               regions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     regionName:
 *                       type: string
 *                     regionPokedexNumber:
 *                       type: integer
 *               imgUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pokémon créé
 *       400:
 *         description: Erreur de création
 */
router.post(
  '/',
  auth,
  hasPermission(permissions.CAN_CREATE_PKMN),
  pkmnController.createPokemon
);

/**
 * @swagger
 * /pkmn/region:
 *   post:
 *     summary: Ajoute une région à un Pokémon
 *     tags: [Pokemon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pkmnID:
 *                 type: string
 *               regionName:
 *                 type: string
 *               regionPokedexNumber:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Région ajoutée/modifiée
 *       404:
 *         description: Pokémon non trouvé
 */
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

/**
 * @swagger
 * /pkmn/region:
 *   delete:
 *     summary: Supprime une région d'un Pokémon
 *     tags: [Pokemon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pkmnID
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: regionName
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       204:
 *         description: Région supprimée
 *       404:
 *         description: Pokémon non trouvé
 */
router.delete(
  '/region',
  auth,
  hasPermission(permissions.CAN_DELETE_PKMN),
  pkmnController.deleteRegion
);

/**
 * @swagger
 * /pkmn/{id}:
 *   put:
 *     summary: Met à jour un Pokémon existant
 *     tags: [Pokemon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du Pokémon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pokemon'
 *     responses:
 *       200:
 *         description: Pokémon modifié
 *       404:
 *         description: Pokémon non trouvé
 */
router.put(
  '/:id',
  auth,
  hasPermission(permissions.CAN_EDIT_PKMN),
  pkmnController.updatePokemon
);

/**
 * @swagger
 * /pkmn/{id}:
 *   delete:
 *     summary: Supprime un Pokémon
 *     tags: [Pokemon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Pokémon supprimé
 *       404:
 *         description: Pokémon non trouvé
 */

router.delete(
  '/:id',
  auth,
  hasPermission(permissions.CAN_DELETE_PKMN),
  pkmnController.deletePokemon
);

/**
 * @swagger
 * /pkmn/{id}/tag:
 *   post:
 *     summary: Tag un Pokémon (exemple d'action utilisateur)
 *     tags: [Pokemon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pokémon taggé
 */

//Route lié à l'utilisateur lui même donc permissions partagé ? pas encore très cohérent.
router.post(
  '/:id/tag',
  auth,
  hasPermission(permissions.CAN_TAG_PKMN),
  pkmnController.tagPokemon
);


module.exports = router;