export interface Pokemon {
    _id: string;
    name: string;
    types: string[];
    description: string;
    regions: {
        regionName: string;
        regionPokedexNumber: number;
    }[];
    imgUrl: string;
    createdAt: string;
    updatedAt: string;
}