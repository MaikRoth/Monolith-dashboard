import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, from } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';

export interface Player {
  playerId: string;
  playerName: string;
}

export interface Robot {
  id: string;
  health: number;
  energy: number;
  planet: string;
}

@Injectable({
  providedIn: 'root'
})
export class RobotService {
  private apiUrl = 'http://localhost:8082/robots';

  constructor(private http: HttpClient) { }

  getRobots(players: Player[]): Observable<any[]> {
    return from(players).pipe(
      mergeMap(player =>
        this.http.get<Robot[]>(`${this.apiUrl}?player-id=${player.playerId}`).pipe(
          mergeMap(robots => robots.map(robot => ({ ...robot, playerName: player.playerName, playerId: player.playerId })))
        )
      ),
      toArray()
    );
  }
}