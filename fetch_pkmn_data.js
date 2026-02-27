const fs = require('fs');
const crypto = require('crypto');

function getPokepediaHash(filename) {
    const hash = crypto.createHash('md5').update(filename).digest('hex');
    return `${hash[0]}/${hash.substring(0, 2)}`;
}

async function getPokemonData(id, regionName) {
    console.log(`Fetching ${id}...`);
    try {
        const pRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pData = await pRes.json();

        const sRes = await fetch(pData.species.url);
        const sData = await sRes.json();

        const nameFr = sData.names.find(n => n.language.name === 'fr')?.name || pData.name;
        const categoryFr = sData.genera.find(g => g.language.name === 'fr')?.genus || "";

        let descFr = "";
        const flavor = sData.flavor_text_entries.find(f => f.language.name === 'fr');
        if (flavor) {
            descFr = flavor.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ');
        }

        const typeMap = {
            "grass": "PLANTE", "poison": "POISON", "fire": "FEU", "flying": "VOL",
            "water": "EAU", "bug": "INSECTE", "normal": "NORMAL", "electric": "ELECTRIK",
            "ground": "SOL", "fairy": "FEE", "fighting": "COMBAT", "psychic": "PSY",
            "rock": "ROCHE", "steel": "ACIER", "ice": "GLACE", "ghost": "SPECTRE",
            "dragon": "DRAGON", "dark": "TENEBRES"
        };
        const types = pData.types.map(t => typeMap[t.type.name] || t.type.name.toUpperCase());

        const stats = {
            hp: pData.stats[0].base_stat,
            atk: pData.stats[1].base_stat,
            def: pData.stats[2].base_stat,
            spa: pData.stats[3].base_stat,
            spd: pData.stats[4].base_stat,
            spe: pData.stats[5].base_stat
        };

        const paddedId = String(id).padStart(4, '0');
        const cryFilename = `Cri_${paddedId}_HOME.ogg`;
        const cryHash = getPokepediaHash(cryFilename);
        const cryUrl = `https://www.pokepedia.fr/images/${cryHash}/${cryFilename}`;

        const imgUrl = pData.sprites.other['official-artwork'].front_default;

        let regNum = id;
        const regEntry = sData.pokedex_numbers.find(n => n.pokedex.name === regionName.toLowerCase());
        if (regEntry) regNum = regEntry.entry_number;

        const isLegendary = sData.is_legendary || sData.is_mythical || false;

        return {
            name: nameFr,
            types,
            category: categoryFr,
            height: pData.height / 10,
            weight: pData.weight / 10,
            description: descFr,
            imgUrl,
            cryUrl,
            stats,
            isLegendary,
            regions: [{ regionName, regionPokedexNumber: regNum }]
        };
    } catch (e) {
        console.error(`Error ${id}:`, e.message);
        return null;
    }
}

// Helper to fetch Mega Evolutions for a base Pokémon ID
async function getMegaEvolutions(baseId, regionName) {
    try {
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${baseId}`);
        const speciesData = await speciesRes.json();
        const megaVarieties = speciesData.varieties.filter(v => !v.is_default && v.pokemon.name.includes('mega'));
        const megas = [];
        for (const variety of megaVarieties) {
            const match = variety.pokemon.url.match(/\/pokemon\/(\d+)\//);
            if (!match) continue;
            const megaId = parseInt(match[1]);
            const megaData = await getPokemonData(megaId, regionName);
            if (megaData) {
                megaData.isMega = true;
                megas.push(megaData);
            }
        }
        return megas;
    } catch (e) {
        console.error(`Mega fetch error for ${baseId}:`, e.message);
        return [];
    }
}

async function main() {
    const all = [];
    const ranges = [
        { start: 1, end: 151, region: "Kanto" },
        { start: 152, end: 251, region: "Johto" },
        { start: 252, end: 386, region: "Hoenn" },
        { start: 387, end: 493, region: "Sinnoh" },
        { start: 494, end: 649, region: "Unys" }
    ];

    for (const r of ranges) {
        console.log(`--- Fetching ${r.region} ---`);
        for (let i = r.start; i < r.end; i++) {
            const data = await getPokemonData(i, r.region);
            if (data) {
                all.push(data);
                const megas = await getMegaEvolutions(i, r.region);
                all.push(...megas);
            }
            await new Promise(res => setTimeout(res, 100));
        }
    }

    fs.writeFileSync('pkmn_dataset.json', JSON.stringify(all, null, 4));
}

main();
