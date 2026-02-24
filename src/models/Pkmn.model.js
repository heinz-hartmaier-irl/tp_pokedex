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
    validate:[
        {
        validator: function (val) {
            return val.length >= 1 && val.length <= 2;
        },
        message: "Un Pokémon doit avoir 1 ou 2 types"
        },
        {
            validator : function (val){
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

  regions: {
    type: [regionSchema],
    default: []
  },

  imgUrl: {
    type: String,
    required: true
  }

}, { timestamps: true });

const pokemonModel = mongoose.model('Pokemon', pokemonSchema);

module.exports = pokemonModel;