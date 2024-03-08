// robot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Player {
  playerId: string;
  playerName: string;
}

export interface Robot {
  playerId: string;
  playerName: string;
  robots: any[]; 
}

@Injectable({
  providedIn: 'root'
})
export class RobotService {
  private apiUrl = 'http://localhost:4006/get-robots';

  constructor(private http: HttpClient) { }

  getRobots(players: Player[]): Observable<Robot[]> {
    return this.http.post<Robot[]>(this.apiUrl, players);
  }
}
