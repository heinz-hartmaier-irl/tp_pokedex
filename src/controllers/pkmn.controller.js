const pkmnService = require('../services/pkmn.service');
const pokemonModel = require('../models/Pkmn.model');
const userModel = require('../models/user.model');


const getTypes = (req, res) => {
  const types = pkmnService.getAllTypes();

  res.status(200).json({
    success: true,
    count: types.length,
    data: types
  });
};



const getAll = (req, res) => {
  res.status(200).json({ data: [] });
};


const getOne = async (req, res) => {
  const { id } = req.params;
  const pokemon = await pokemonModel.findById(id);
  if (!pokemon) {
    return res.status(404).json({ message: "Pokémon non trouvé" });
  }
  res.status(200).json({ data: pokemon });
};


const search = (req, res) => {
  res.status(200).json({ data: [] });
};


const createPokemon = (req, res) => {
  res.status(201).json({ message: "Pokémon créé (temporaire)" });
};


const tagPokemon = (req, res) => {
  res.status(200).json({ message: `Pokémon ${req.params.id} taggé (temporaire)` });
};

const deletePokemon = (req, res) => {
try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send({ message: 'Utilisateur non trouvé' });
    res.status(200).send({ message: 'Utilisateur supprimé', id: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = {
  getTypes,
  getAll,
  createPokemon,
  tagPokemon,
  search,
  getOne,
  deletePokemon
};