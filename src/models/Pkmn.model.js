const mongoose = require('mongoose');
const pokemonSchema = new mongoose.Schema({
    id: Number,
    name: String,
    type: [String],
    description: String,
    regions: [{
        "regionName": String,
        "regionPokedexNumber": Number

    }],
    imgUrl: String
});

const pokemonModel = mongoose.model('Pokemon', pokemonSchema);

module.exports = pokemonModel;
