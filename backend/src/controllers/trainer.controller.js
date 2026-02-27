const Trainer = require('../models/trainer.model');
const Pokemon = require('../models/Pkmn.model');

const userModel = require('../models/user.model');
const trainerModel = require('../models/trainer.model');

const createTrainer = async (req, res) => {
  try {

    const user = await userModel.findById(req.auth.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });


    const existingTrainer = await trainerModel.findOne({ username: user.username });
    if (existingTrainer) return res.status(400).json({ message: "Trainer déjà créer pour cette utilisateur" });

    const trainer = await trainerModel.create({
      username: user.username,
      trainerName: req.body.trainerName,
      imgUrl: req.body.imgUrl || "",
      creationDate: new Date(),
      pkmnSeen: [],
      pkmnCatch: []
    });

    res.status(201).json(trainer);

  } catch (err) {
    res.status(400).json({ message: "Erreur création Trainer", error: err });
  }
};

const getTrainer = async (req, res) => {
  try {
    const user = await userModel.findById(req.auth.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const trainer = await Trainer.findOne({ username: user.username })
      .populate('pkmnSeen', 'name imgUrl')
      .populate('pkmnCatch', 'name imgUrl');

    if (!trainer) {
      return res.status(404).json({ message: "Trainer non trouvé" });
    }

    res.status(200).json(trainer);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération Trainer", error: err });
  }
};


const updateTrainer = async (req, res) => {
  try {
    const user = await userModel.findById(req.auth.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const trainer = await Trainer.findOneAndUpdate(
      { username: user.username },
      req.body,
      { new: true }
    );

    if (!trainer) return res.status(404).json({ message: "Trainer non trouvé" });

    res.status(200).json(trainer);
  } catch (err) {
    res.status(500).json({ message: "Erreur modification Trainer", error: err });
  }
};


const deleteTrainer = async (req, res) => {
  try {
    const user = await userModel.findById(req.auth.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const trainer = await Trainer.findOneAndDelete({ username: user.username });
    if (!trainer) return res.status(404).json({ message: "Trainer non trouvé" });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression Trainer", error: err });
  }
};


const markPokemon = async (req, res) => {
  try {
    const user = await userModel.findById(req.auth.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    const { pkmnID, isCaptured } = req.body;

    const trainer = await Trainer.findOne({ username: user.username });
    if (!trainer) return res.status(404).json({ message: "Trainer non trouvé" });

    const pokemon = await Pokemon.findById(pkmnID);
    if (!pokemon) return res.status(404).json({ message: "Pokémon non trouvé" });

    if (isCaptured) {
      if (!trainer.pkmnCatch.includes(pkmnID)) trainer.pkmnCatch.push(pkmnID);
      // Ensure captured also counts as seen
      if (!trainer.pkmnSeen.includes(pkmnID)) trainer.pkmnSeen.push(pkmnID);
    } else {
      if (!trainer.pkmnSeen.includes(pkmnID)) trainer.pkmnSeen.push(pkmnID);
    }

    await trainer.save();
    const populatedTrainer = await trainerModel.findById(trainer._id)
      .populate('pkmnSeen', 'name imgUrl')
      .populate('pkmnCatch', 'name imgUrl');

    res.status(200).json(populatedTrainer);

  } catch (err) {
    res.status(500).json({ message: "Erreur ajout Pokémon", error: err });
  }
};

module.exports = {
  createTrainer,
  getTrainer,
  updateTrainer,
  deleteTrainer,
  markPokemon
};