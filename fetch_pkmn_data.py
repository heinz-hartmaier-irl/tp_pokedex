import requests
import json
import hashlib
import time
import os

def get_pokepedia_hash(filename):
    m = hashlib.md5()
    m.update(filename.encode('utf-8'))
    h = m.hexdigest()
    return f"{h[0]}/{h[0:2]}"

def get_pokemon_data(pokemon_id, region_name):
    print(f"Fetching {pokemon_id}...")
    try:
        # Get basic data
        p_res = requests.get(f"https://pokeapi.co/api/v2/pokemon/{pokemon_id}")
        p_res.raise_for_status()
        p_data = p_res.json()

        # Get species data (for French translation)
        s_res = requests.get(p_data['species']['url'])
        s_res.raise_for_status()
        s_data = s_res.json()

        # Extract French Name
        name_fr = next((n['name'] for n in s_data['names'] if n['language']['name'] == 'fr'), p_data['name'].capitalize())
        
        # Extract French Category (Genus)
        category_fr = next((g['genus'] for g in s_data['genera'] if g['language']['name'] == 'fr'), "")
        
        # Extract French Description
        desc_fr = ""
        for flavor in s_data['flavor_text_entries']:
            if flavor['language']['name'] == 'fr':
                desc_fr = flavor['flavor_text'].replace('\n', ' ').replace('\f', ' ')
                break

        # Types mapping
        type_map = {
            "grass": "PLANTE", "poison": "POISON", "fire": "FEU", "flying": "VOL", 
            "water": "EAU", "bug": "INSECTE", "normal": "NORMAL", "electric": "ELECTRIK",
            "ground": "SOL", "fairy": "FEE", "fighting": "COMBAT", "psychic": "PSY",
            "rock": "ROCHE", "steel": "ACIER", "ice": "GLACE", "ghost": "SPECTRE",
            "dragon": "DRAGON", "dark": "TENEBRES"
        }
        types = [type_map.get(t['type']['name'], t['type']['name'].upper()) for t in p_data['types']]

        # Stats mapping
        stats = {
            "hp": p_data['stats'][0]['base_stat'],
            "atk": p_data['stats'][1]['base_stat'],
            "def": p_data['stats'][2]['base_stat'],
            "spa": p_data['stats'][3]['base_stat'],
            "spd": p_data['stats'][4]['base_stat'],
            "spe": p_data['stats'][5]['base_stat']
        }

        # URLs
        padded_id = str(pokemon_id).zfill(4)
        cry_filename = f"Cri_{padded_id}_HOME.ogg"
        cry_hash = get_pokepedia_hash(cry_filename)
        cry_url = f"https://www.pokepedia.fr/images/{cry_hash}/{cry_filename}"

        # Image fallback to PokéAPI official artwork
        img_url = p_data['sprites']['other']['official-artwork']['front_default']

        # Weight/Height
        height = p_data['height'] / 10.0 # to meters
        weight = p_data['weight'] / 10.0 # to kg

        # Regional Number
        reg_num = pokemon_id
        for entry in s_data['pokedex_numbers']:
            if entry['pokedex']['name'] == region_name.lower():
                reg_num = entry['entry_number']
                break

        return {
            "name": name_fr,
            "types": types,
            "category": category_fr,
            "height": height,
            "weight": weight,
            "description": desc_fr,
            "imgUrl": img_url,
            "cryUrl": cry_url,
            "stats": stats,
            "regions": [
                {
                    "regionName": region_name,
                    "regionPokedexNumber": reg_num
                }
            ]
        }
    except Exception as e:
        print(f"Error fetching {pokemon_id}: {e}")
        return None

def main():
    all_pokemon = []
    
    # Due to time limits in AGENTIC mode for large loops, 
    # I will limit this to roughly top 30 per generation for the first run
    # to ensure the user gets a working set quickly while I sort the UI.
    
    ranges = [
        (1, 151, "Kanto"),
        (152, 251, "Johto"),
        (252, 386, "Hoenn"),
        (387, 493, "Sinnoh"),
        (494, 649, "Unys")
        ]
    
    for start, end, region in ranges:
        print(f"--- Fecthing {region} ---")
        for i in range(start, end + 1):
            data = get_pokemon_data(i, region)
            if data: all_pokemon.append(data)
            time.sleep(0.2)

    with open('pkmn_dataset.json', 'w', encoding='utf-8') as f:
        json.dump(all_pokemon, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    main()
