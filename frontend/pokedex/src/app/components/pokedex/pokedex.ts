import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon';
import { TrainerService } from '../../services/trainer';
import { Trainer } from '../../models/trainer.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.css',
})
export class Pokedex implements OnInit {
  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    speechSynthesis.speak(utterance);
  }

  pokemons: Pokemon[] = [];
  selectedPokemon: Pokemon | null = null;
  error = '';
  isLoading = false;
  isInitialized = false;
  private loadingTimeout: any;

  playCry(pokemon: Pokemon) {
    if (pokemon.cryUrl) {
      const audio = new Audio(pokemon.cryUrl);
      audio.play().catch(err => console.error("Erreur lecture cri:", err));
    }
  }

  trainer!: Trainer;


  constructor(
    private pokemonService: PokemonService,
    private trainerService: TrainerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.checkInitialLoadingState();
    this.loadData();
  }

  private checkInitialLoadingState() {
    const cachedPkmn = sessionStorage.getItem('pkmn_cache');
    const cachedTrainer = sessionStorage.getItem('trainer_cache');

    if (cachedPkmn && cachedTrainer) {
      this.pokemons = JSON.parse(cachedPkmn);
      this.trainer = JSON.parse(cachedTrainer);
      this.isLoading = false;
      this.isInitialized = true;
    } else {
      this.loadingTimeout = setTimeout(() => {
        if (!this.isInitialized) {
          this.isLoading = true;
          this.cdr.detectChanges();
        }
      }, 300);
    }
  }

  loadData() {
    forkJoin({
      pokemons: this.pokemonService.getAll(),
      trainer: this.trainerService.getTrainer()
    }).subscribe({
      next: (result) => {
        this.pokemons = result.pokemons;
        this.trainer = result.trainer;

        // Update Caches
        sessionStorage.setItem('pkmn_cache', JSON.stringify(this.pokemons));
        sessionStorage.setItem('trainer_cache', JSON.stringify(this.trainer));

        this.isInitialized = true;
        this.clearLoading();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des données.';
        this.isInitialized = true;
        this.clearLoading();
        this.cdr.detectChanges();
      }
    });
  }




  private clearLoading() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    this.isLoading = false;
  }


  selectPokemon(pokemon: Pokemon) {
    this.selectedPokemon = pokemon;
  }

  toggleSeen(pokemon: Pokemon) {
    const isSeen = this.isSeen(pokemon);
    // Note: The backend markPokemon handles both seen/catch. 
    // We pass isCaptured=false but the logic in marking might need check.
    // However, based on existing markPokemon(pkmnID, isCaptured), 
    // it adds to pkmnSeen if isCaptured is false.
    this.trainerService.markPokemon(pokemon._id, false)
      .subscribe(updatedTrainer => {
        this.trainer = updatedTrainer as Trainer;
        sessionStorage.setItem('trainer_cache', JSON.stringify(this.trainer));
        this.cdr.detectChanges();
      });
  }

  toggleCatch(pokemon: Pokemon) {
    this.trainerService.markPokemon(pokemon._id, true)
      .subscribe(updatedTrainer => {
        this.trainer = updatedTrainer as Trainer;
        sessionStorage.setItem('trainer_cache', JSON.stringify(this.trainer));
        this.cdr.detectChanges();
      });
  }

  isSeen(pokemon: Pokemon): boolean {
    return this.trainer?.pkmnSeen?.some(p => p._id === pokemon._id) ?? false;
  }

  isCaught(pokemon: Pokemon): boolean {
    return this.trainer?.pkmnCatch?.some(p => p._id === pokemon._id) ?? false;
  }

  getTypeClass(pokemon: Pokemon): string {
    if (!pokemon || !this.isSeen(pokemon) || !pokemon.types || pokemon.types.length === 0) {
      return '';
    }
    const primaryType = pokemon.types[0].toLowerCase();
    return `type-${primaryType} type-active`;
  }
}

