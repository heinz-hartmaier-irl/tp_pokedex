const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Use the connection string from server.js
const mongoURI = 'mongodb://127.0.0.1:27017/td';

// Import the Pkmn model
// Based on the file structure: backend/src/models/Pkmn.model.js
const Pkmn = require('./src/models/Pkmn.model');

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('Connected!');

        // Read the generated dataset
        const dataPath = path.join(__dirname, 'pkmn_dataset.json');
        if (!fs.existsSync(dataPath)) {
            console.error('Error: pkmn_dataset.json not found!');
            process.exit(1);
        }

        const pokemons = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        console.log(`Read ${pokemons.length} Pokémon from dataset.`);

        // Clear existing Pokémon to avoid duplicates 
        // (Optional: remove this if you want to keep existing ones)
        console.log('Cleaning up existing Pokémon...');
        await Pkmn.deleteMany({});

        // Bulk insert
        console.log('Inserting Pokémon into database...');
        await Pkmn.insertMany(pokemons);

        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Seed error:', err);
    } finally {
        mongoose.connection.close();
        console.log('Connection closed.');
    }
}

seedDatabase();
