const pkmnService = require('../services/pkmn.service');

const getTypes = (req, res) => {
  const types = pkmnService.getAllTypes();

  res.status(200).json({
    success: true,
    count: types.length,
    data: types
  });
};


//Fonction temporaire le temps des tests 

// Temporaire : retourne tous les pokemons
const getAll = (req, res) => {
  res.status(200).json({ data: [] });
};

// Temporaire : création de pokemon
const createPokemon = (req, res) => {
  res.status(201).json({ message: "Pokémon créé (temporaire)" });
};

// Temporaire : tag d’un pokemon
const tagPokemon = (req, res) => {
  res.status(200).json({ message: `Pokémon ${req.params.id} taggé (temporaire)` });
};

module.exports = {
  getTypes,
  getAll,
  createPokemon,
  tagPokemon
};