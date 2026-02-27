import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../../services/pokemon';
import { Pokemon } from '../../../models/pokemon.model';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
    selector: 'app-pkmn-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './pkmn-admin.html',
    styleUrl: './pkmn-admin.css'
})
export class PkmnAdmin implements OnInit, OnDestroy {
    pokemons: Pokemon[] = [];
    filteredPokemons: Pokemon[] = [];
    searchQuery = '';
    showForm = false;
    isEditing = false;
    loading = false;

    // Pagination
    currentPage = 1;
    pageSize = 15;
    totalPages = 1;

    private searchSubject = new Subject<string>();
    private searchSub?: Subscription;

    currentPkmn: any = this.getEmptyPkmn();

    availableTypes = [
        "NORMAL", "FEU", "EAU", "PLANTE", "ELECTRIK", "GLACE",
        "COMBAT", "POISON", "SOL", "VOL", "PSY", "INSECTE",
        "ROCHE", "SPECTRE", "DRAGON", "TENEBRES", "ACIER", "FEE"
    ];

    constructor(private pokemonService: PokemonService) { }

    ngOnInit() {
        this.loadAll();

        this.searchSub = this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(() => {
            this.applyFilter();
        });
    }

    ngOnDestroy() {
        this.searchSub?.unsubscribe();
    }

    onSearchInput() {
        this.searchSubject.next(this.searchQuery);
    }

    loadAll() {
        this.loading = true;
        this.pokemonService.getAll().subscribe({
            next: (data) => {
                this.pokemons = data;
                this.applyFilter();
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    applyFilter() {
        if (!this.searchQuery) {
            this.filteredPokemons = this.pokemons;
        } else {
            const query = this.searchQuery.toLowerCase();
            this.filteredPokemons = this.pokemons.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.regions.some(r => r.regionName.toLowerCase().includes(query))
            );
        }
        this.currentPage = 1;
        this.updateTotalPages();
    }

    updateTotalPages() {
        this.totalPages = Math.ceil(this.filteredPokemons.length / this.pageSize) || 1;
    }

    get paginatedPokemons() {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.filteredPokemons.slice(start, start + this.pageSize);
    }

    setPage(page: number) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
    }

    getEmptyPkmn() {
        return {
            name: '',
            types: [],
            description: '',
            imgUrl: '',
            category: '',
            height: 0,
            weight: 0,
            stats: { hp: 50, atk: 50, def: 50, spa: 50, spd: 50, spe: 50 },
            isLegendary: false,
            regions: [{ regionName: 'Kanto', regionPokedexNumber: 0 }]
        };
    }

    openCreate() {
        this.isEditing = false;
        this.currentPkmn = this.getEmptyPkmn();
        this.showForm = true;
    }

    openEdit(pkmn: Pokemon) {
        this.isEditing = true;
        this.currentPkmn = JSON.parse(JSON.stringify(pkmn)); // deep copy
        this.showForm = true;
    }

    closeForm() {
        this.showForm = false;
    }

    toggleType(type: string) {
        const index = this.currentPkmn.types.indexOf(type);
        if (index > -1) {
            this.currentPkmn.types.splice(index, 1);
        } else if (this.currentPkmn.types.length < 2) {
            this.currentPkmn.types.push(type);
        }
    }

    addRegion() {
        this.currentPkmn.regions.push({ regionName: '', regionPokedexNumber: 0 });
    }

    removeRegion(index: number) {
        this.currentPkmn.regions.splice(index, 1);
    }

    save() {
        if (this.isEditing) {
            this.pokemonService.update(this.currentPkmn._id, this.currentPkmn).subscribe(() => {
                this.loadAll();
                this.closeForm();
            });
        } else {
            this.pokemonService.create(this.currentPkmn).subscribe(() => {
                this.loadAll();
                this.closeForm();
            });
        }
    }

    delete(id: string) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce Pokémon ?')) {
            this.pokemonService.delete(id).subscribe(() => {
                this.loadAll();
            });
        }
    }
}
