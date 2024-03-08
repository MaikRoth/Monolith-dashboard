import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
export interface Game {
  gameId: string;
  gameStatus: string;
  maxPlayers: number;
  maxRounds: number;
  currentRoundNumber: number | null;
  roundLengthInMillis: number;
  participatingPlayers: string[];
}
@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = 'http://localhost:8080/games';

  constructor(private http: HttpClient) { }

  getFirstGame(): Observable<Game> {
    return this.http.get<Game[]>(this.apiUrl).pipe(
      map(games => games[0])
    );
  }
  createGame(maxPlayers: number, maxRounds: number): Observable<any> {
    const payload = { maxPlayers, maxRounds };
    return this.http.post(this.apiUrl, payload);
  }
  startGame(gameId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${gameId}/gameCommands/start`, {});
  }

  endGame(gameId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${gameId}/gameCommands/end`, {});
  }
  updateMaxRounds(gameId: string, maxRounds: number): Observable<any> {
    const url = `${this.apiUrl}/${gameId}/maxRounds`;
    return this.http.patch(url, { maxRounds });
  }
  updateRoundTime(gameId: string, duration: number): Observable<any> {
    const url = `${this.apiUrl}/${gameId}/duration`;
    return this.http.patch(url, { duration });
  }
}
