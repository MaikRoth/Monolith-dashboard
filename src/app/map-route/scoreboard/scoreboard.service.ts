import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Achievement {
  gameId: string;
  achievement: {
    name: string;
    image: string;
    category: string;
  };
}

export interface ScoreboardEntry {
  player: {
    id: string;
    name: string;
  };
  totalScore: number;
  fightingScore: number;
  miningScore: number;
  tradingScore: number;
  travelingScore: number;
  achievements: Achievement[];
}

export interface ScoreboardData {
  gameId: string;
  gameStatus: string;
  roundNumber: number;
  scoreboardEntriesWithAchievements: ScoreboardEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class ScoreboardService {
  private apiUrl = 'http://localhost:8089/scoreboard-with-achievements';
  constructor( private http : HttpClient) { }

  getScoreboardData(): Observable<ScoreboardData> {
    return this.http.get<ScoreboardData>(this.apiUrl);
  }
  getPlayerNamesWithIds(scoreboardData: any): { playerId: string, playerName: string }[] {
    return scoreboardData.scoreboardEntriesWithAchievements.map((entry: any) => ({
      playerId: entry.player.id,
      playerName: entry.player.name
    }));
  }
}


