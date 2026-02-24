const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainer.controller');


const auth  = require('../middlewares/auth.middleware');
/**
 * @swagger
 * tags:
 *   name: Trainer
 *   description: Gestion des dresseurs et des Pokémon associés
 */

/**
 * @swagger
 * /trainer:
 *   post:
 *     summary: Crée un nouveau Trainer pour l'utilisateur connecté
 *     tags: [Trainer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trainerName:
 *                 type: string
 *               imgUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Trainer créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trainer'
 *       400:
 *         description: Trainer déjà existant ou erreur
 */
router.post('/', auth, trainerController.createTrainer);

/**
 * @swagger
 * /trainer:
 *   get:
 *     summary: Récupère le Trainer de l'utilisateur connecté
 *     tags: [Trainer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trainer trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trainer'
 *       404:
 *         description: Trainer non trouvé
 */
router.get('/', auth, trainerController.getTrainer);

/**
 * @swagger
 * /trainer:
 *   put:
 *     summary: Met à jour le Trainer de l'utilisateur connecté
 *     tags: [Trainer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trainer'
 *     responses:
 *       200:
 *         description: Trainer mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trainer'
 *       404:
 *         description: Trainer non trouvé
 */
router.put('/', auth, trainerController.updateTrainer);

/**
 * @swagger
 * /trainer:
 *   delete:
 *     summary: Supprime le Trainer de l'utilisateur connecté
 *     tags: [Trainer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Trainer supprimé
 *       404:
 *         description: Trainer non trouvé
 */
router.delete('/', auth, trainerController.deleteTrainer);

/**
 * @swagger
 * /trainer/mark:
 *   post:
 *     summary: Ajoute un Pokémon au Trainer (vu ou capturé)
 *     tags: [Trainer]
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
 *                 description: ID du Pokémon
 *               isCaptured:
 *                 type: boolean
 *                 description: true si capturé, false si juste vu
 *     responses:
 *       200:
 *         description: Pokémon ajouté au Trainer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trainer'
 *       404:
 *         description: Trainer ou Pokémon non trouvé
 */
router.post('/mark', auth, trainerController.markPokemon); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Trainer:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         trainerName:
 *           type: string
 *         imgUrl:
 *           type: string
 *         creationDate:
 *           type: string
 *           format: date-time
 *         pkmnSeen:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Pokemon'
 *         pkmnCatch:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Pokemon'
 *     Pokemon:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         types:
 *           type: array
 *           items:
 *             type: string
 *         description:
 *           type: string
 *         regions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               regionName:
 *                 type: string
 *               regionPokedexNumber:
 *                 type: integer
 *         imgUrl:
 *           type: string
 */
module.exports = router;