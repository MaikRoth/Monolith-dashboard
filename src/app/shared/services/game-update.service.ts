import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameUpdateService {
  private gameUpdateSource = new Subject<void>();
  gameUpdate$ = this.gameUpdateSource.asObservable();

  notifyGameUpdate() {
    this.gameUpdateSource.next();
  }
}