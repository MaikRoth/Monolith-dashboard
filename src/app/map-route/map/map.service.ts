import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface GameWorld {
  id: string;
  status: string;
  mapGrid: {
    size: number;
    planets: { [key: string]: Planet };
  };
}

export interface Planet {
  id: string;
  x: number;
  y: number;
  resource?: {
    type: string;
    maxAmount: number;
    currentAmount: number;
  };
  robots: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private apiUrl = 'http://localhost:8081/gameworlds/';

  constructor(private http: HttpClient) { }

  getMapData(): Observable<GameWorld[]> {
    return this.http.get<GameWorld[]>(this.apiUrl);
  }
}