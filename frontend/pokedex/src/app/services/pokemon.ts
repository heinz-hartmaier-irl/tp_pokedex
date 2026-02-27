import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'http://localhost:3000/pkmn';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Pokemon[]> {
    return this.http.get<{ data: Pokemon[] }>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }

  search(typeOne?: string, partialName?: string): Observable<Pokemon[]> {
    let params: any = { page: 1, size: 1000 }; // Fetch a large enough set for the UI
    if (typeOne) params.typeOne = typeOne;
    if (partialName) params.partialName = partialName;

    return this.http.get<{ data: Pokemon[] }>(`${this.apiUrl}/search`, { params }).pipe(
      map(res => res.data)
    );
  }

  getById(id: string): Observable<Pokemon> {
    return this.http.get<{ data: Pokemon }>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  create(pokemon: Pokemon): Observable<Pokemon> {
    return this.http.post<Pokemon>(this.apiUrl, pokemon);
  }

  update(id: string, pokemon: Pokemon): Observable<Pokemon> {
    return this.http.put<Pokemon>(`${this.apiUrl}/${id}`, pokemon);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
