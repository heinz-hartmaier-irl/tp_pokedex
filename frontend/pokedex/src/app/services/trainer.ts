import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Trainer } from '../models/trainer.model';

@Injectable({ providedIn: 'root' })
export class TrainerService {

  private apiUrl = 'http://localhost:3000/trainer';

  constructor(private http: HttpClient) { }

  getTrainer() {
    return this.http.get<Trainer>(this.apiUrl);
  }

  createTrainer(trainerName: string, imgUrl: string) {
    return this.http.post<Trainer>(this.apiUrl, { trainerName, imgUrl });
  }

  markPokemon(pkmnID: string, isCaptured: boolean) {
    return this.http.post(`${this.apiUrl}/mark`, {
      pkmnID,
      isCaptured
    });
  }
}
