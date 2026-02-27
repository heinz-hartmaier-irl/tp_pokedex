const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');


const mongoURI = 'mongodb://127.0.0.1:27017/td';


const Pkmn = require('./src/models/Pkmn.model');

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('Connected!');

        // Read the generated dataset
        const dataPath = path.join(__dirname, '../pkmn_dataset.json');
        if (!fs.existsSync(dataPath)) {
            console.error('Error: pkmn_dataset.json not found!');
            process.exit(1);
        }

        let pokemons = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        pokemons = pokemons.filter(p => p.imgUrl != null);

        const seenNames = new Set();
        pokemons = pokemons.filter(p => {
            if (p.isMega) {
                p.name += ' (Mega)';
            }
            if (seenNames.has(p.name)) {
                return false;
            }
            seenNames.add(p.name);
            return true;
        });

        console.log(`Read ${pokemons.length} unique Pokémon with valid images from dataset.`);

        // Clear existing Pokémon to avoid duplicates 
        console.log('Cleaning up existing Pokémon...');
        await Pkmn.deleteMany({});

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
