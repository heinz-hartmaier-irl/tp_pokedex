import { Pokemon } from "./pokemon.model";

export interface Trainer {
    _id: string;
    username: string;
    trainerName: string;
    imgUrl: string;
    pkmnCatch: Pokemon[];
    pkmnSeen: Pokemon[];
    creationDate: string;
}
