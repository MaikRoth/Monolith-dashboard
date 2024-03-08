import { Component, OnInit } from '@angular/core';
import { Game, GameService } from './game.service';
import { Subscription, interval, startWith, switchMap } from 'rxjs';
import { GameUpdateService } from '../../shared/services/game-update.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {

  game?: Game;
  private gameUpdateSubscription: Subscription;

  constructor(private gameService: GameService, private gameUpdateService: GameUpdateService) { }


  ngOnInit(): void {
    this.gameUpdateSubscription = this.gameUpdateService.gameUpdate$.subscribe(() => {
      this.fetchGameData();
    });
  }
  ngOnDestroy(): void {
    this.gameUpdateSubscription.unsubscribe();
  }
  fetchGameData(): void {
    this.gameService.getFirstGame().subscribe(game => {
      this.game = game;
    });
  }

}
