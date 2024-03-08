import { Component, OnInit } from '@angular/core';
import { GameService } from '../game/game.service';
import { GameUpdateService } from '../../shared/services/game-update.service';

@Component({
  selector: 'app-controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrl: './controlpanel.component.css'
})
export class ControlpanelComponent implements OnInit {
  maxPlayers: number = 6;
  maxRounds: number = 200;
  roundDuration: number = 15000;
  gameId: string = '';
  constructor(private gameService: GameService, private gameUpdateService: GameUpdateService) { }

  triggerGameUpdate() {
    this.gameUpdateService.notifyGameUpdate();
  }

  ngOnInit() {
    this.fetchGameId();
  }

  fetchGameId() {
    this.gameService.getFirstGame().subscribe({
      next: (game) => {
        if (!game) {
          console.error('No game found.');
          return;
        }
        this.gameId = game.gameId;
        console.log('Game ID fetched successfully', this.gameId);
        this.triggerGameUpdate();
      },
      error: (error) => {
        console.error('Error fetching game ID', error);
        this.triggerGameUpdate();
      }
    });
    
  }

  createGame() {
    this.gameService.createGame(this.maxPlayers, this.maxRounds).subscribe({
      next: (response) => {
        console.log('Game created successfully', response);
        this.gameId = response.gameId;
        this.triggerGameUpdate();
      },
      error: (error) => {
        console.error('Error creating game', error);
        this.triggerGameUpdate();
      }
    });
    
  }

  startGame() {
    if (!this.gameId) {
      console.error('Game ID is not available.');
      this.triggerGameUpdate();
      return;
    }
    this.gameService.startGame(this.gameId).subscribe({
      next: () => this.triggerGameUpdate(),
      error: () => this.triggerGameUpdate()
    });

  }

  endGame() {
    if (!this.gameId) {
      console.error('Game ID is not available.');
      return;
    }
    this.gameService.endGame(this.gameId).subscribe({
      next: () => this.triggerGameUpdate(),
      error: () => this.triggerGameUpdate()
    });
    this.triggerGameUpdate();

  }
  updateMaxRounds(): void {
    this.gameService.updateMaxRounds(this.gameId, this.maxRounds).subscribe({
      next: () => this.triggerGameUpdate(),
      error: () => this.triggerGameUpdate()
    });
    

  }

  updateRoundTime(): void {
    this.gameService.updateRoundTime(this.gameId, this.roundDuration).subscribe({
      next: () => this.triggerGameUpdate(),
      error: () => this.triggerGameUpdate()
    });
    

  }
}
