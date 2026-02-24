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


const search = async (req, res) => {
  try {
    const { page = 1, size = 10, typeOne, typeTwo, partialName } = req.query;

    let filter = {};

    if (typeOne) filter.types = typeOne;
    if (partialName) filter.name = { $regex: partialName, $options: "i" };

    const pokemons = await pokemonModel
      .find(filter)
      .skip((page - 1) * size)
      .limit(Number(size));

    const count = await pokemonModel.countDocuments(filter);

    res.status(200).json({
      count,
      data: pokemons
    });

  } catch (err) {
    res.status(400).json({ message: "Erreur recherche", error: err });
  }
};


const createPokemon = async (req, res) => {
  try {
    const { name, types, description, imgUrl } = req.body;

    const existing = await pokemonModel.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Ce Pokémon existe déjà" });
    }

    const pokemon = await pokemonModel.create({
      name,
      types,
      description,
      imgUrl
    });

    res.status(201).json(pokemon);

  } catch (err) {
    res.status(400).json({
      message: "Erreur création Pokémon",
      error: err
    });
  }
};

const addRegion = async (req, res) => {
  try {
    const { regionName, regionPokedexNumber, pkmnID } = req.body;

    const pokemon = await pokemonModel.findById(pkmnID);
    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }

    const existingRegion = pokemon.regions.find(
      r => r.regionName === regionName
    );

    if (existingRegion) {
      existingRegion.regionPokedexNumber = regionPokedexNumber;
    } else {
      pokemon.regions.push({ regionName, regionPokedexNumber });
    }

    await pokemon.save();

    res.status(200).json(pokemon);
  } catch (err) {
    res.status(400).json({ message: "Erreur ajout région", error: err });
  }
};

const deleteRegion = async (req, res) => {
  try {
    const { pkmnID, regionName } = req.query;

    const pokemon = await pokemonModel.findById(pkmnID);
    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }

    pokemon.regions = pokemon.regions.filter(
      r => r.regionName !== regionName
    );

    await pokemon.save();

    res.status(204).send();

  } catch (err) {
    res.status(400).json({ message: "Erreur suppression région", error: err });
  }
};

const updatePokemon = async (req, res) => {
  try {
    const { id } = req.params;

    const pokemon = await pokemonModel.findByIdAndUpdate(
      id,
      req.body,
      { 
        new: true,
        runValidators: true
      }
    );

    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }

    res.status(200).json(pokemon);

  } catch (err) {
    res.status(400).json({ message: "Erreur modification", error: err });
  }
};

const tagPokemon = (req, res) => {
  res.status(200).json({ message: `Pokémon ${req.params.id} taggé (temporaire)` });
};

const deletePokemon = async (req, res) => {
try {
    const pokemon = await pokemonModel.findByIdAndDelete(req.params.id);
    if (!pokemon) return res.status(404).send({ message: 'Pokémon non trouvé' });
    res.status(200).send({ message: 'Pokémon supprimé', id: pokemon._id });
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
  deletePokemon,
  updatePokemon,
  addRegion,
  deleteRegion
};