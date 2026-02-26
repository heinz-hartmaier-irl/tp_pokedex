const mongoose = require('mongoose');
const PkmnType = require('./PkmnType')

const regionSchema = new mongoose.Schema({
  regionName: {
    type: String,
    required: true
  },
  regionPokedexNumber: {
    type: Number,
    required: true
  }
}, { _id: false });

const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  types: {
    type: [String],
    required: true,
    validate: [
      {
        validator: function (val) {
          return val.length >= 1 && val.length <= 2;
        },
        message: "Un Pokémon doit avoir 1 ou 2 types"
      },
      {
        validator: function (val) {
          return val.every(type => PkmnType.includes(type));
        },
        message: "Un ou plusieurs types sont invalides"
      }
    ]
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: false
  },

  height: {
    type: Number,
    required: false
  },

  weight: {
    type: Number,
    required: false
  },

  stats: {
    hp: { type: Number, default: 0 },
    atk: { type: Number, default: 0 },
    def: { type: Number, default: 0 },
    spa: { type: Number, default: 0 },
    spd: { type: Number, default: 0 },
    spe: { type: Number, default: 0 }
  },

  regions: {
    type: [regionSchema],
    default: []
  },

  imgUrl: {
    type: String,
    required: true
  },

  cryUrl: {
    type: String,
    required: false
  }

}, { timestamps: true });

const pokemonModel = mongoose.model('Pokemon', pokemonSchema);

module.exports = pokemonModel;