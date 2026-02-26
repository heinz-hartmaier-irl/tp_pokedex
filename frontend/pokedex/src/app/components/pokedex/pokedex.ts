import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon';
import { TrainerService } from '../../services/trainer';
import { Trainer } from '../../models/trainer.model';

@Component({
  selector: 'app-pokedex',
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

  trainer!: Trainer;

  constructor(
    private pokemonService: PokemonService,
    private trainerService: TrainerService
  ) { }

  ngOnInit() {
    this.loadPokemons();
    this.loadTrainer();
  }

  loadPokemons() {
    this.pokemonService.getAll().subscribe(data => {
      this.pokemons = data;
    });
  }

  loadTrainer() {
    this.trainerService.getTrainer().subscribe(data => {
      this.trainer = data;
    });
  }

  selectPokemon(pokemon: Pokemon) {
    this.selectedPokemon = pokemon;

    if (!this.trainer.pokemonsSeen.some(p => p._id === pokemon._id)) {
      this.trainerService.markPokemon(pokemon._id, false)
        .subscribe(updatedTrainer => {
          this.trainer = updatedTrainer as Trainer;
        });
    }
  }

  toggleCatch(pokemon: Pokemon) {

    const isAlreadyCaught = this.trainer.capturedPokemons
      .some(p => p._id === pokemon._id);

    if (!isAlreadyCaught) {
      this.trainerService.markPokemon(pokemon._id, true)
        .subscribe(updatedTrainer => {
          this.trainer = updatedTrainer as Trainer;
        });
    }
  }
}
