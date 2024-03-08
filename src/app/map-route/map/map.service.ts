import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Planet {
  id: string;
  x: number;
  y: number;
  movementDifficulty: number;
  resource?: {
    resourceType: string;
    maxAmount: number;
    currentAmount: number;
  };
  robots: any[];
}

export interface PlanetsMap {
  [key: string]: Planet;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private apiUrl = 'http://localhost:4002/wholemap';

  constructor(private http: HttpClient) { }

  getMapData(): Observable<PlanetsMap[]> {
    return this.http.get<PlanetsMap[]>(this.apiUrl);
  }
}
