export interface Pokemon {
    _id: string;
    name: string;
    types: string[];
    description: string;
    category?: string;
    height?: number;
    weight?: number;
    stats?: {
        hp: number;
        atk: number;
        def: number;
        spa: number;
        spd: number;
        spe: number;
    };
    cryUrl?: string;
    isLegendary?: boolean;
    regions: {
        regionName: string;
        regionPokedexNumber: number;
    }[];
    imgUrl: string;
    createdAt: string;
    updatedAt: string;
}