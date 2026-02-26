import { Pokemon } from "./pokemon.model";

export interface Trainer {
    _id: string;
    username: string;
    email: string;
    capturedPokemons: Pokemon[];
    pokemonsSeen: Pokemon[];
    createdAt: string;
    updatedAt: string;
}