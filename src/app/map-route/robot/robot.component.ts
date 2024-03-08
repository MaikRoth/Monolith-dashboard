import { Component, OnInit } from '@angular/core';
import { RobotService } from './robot.service';
import { ScoreboardService } from '../scoreboard/scoreboard.service';
import { interval, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrl: './robot.component.css'
})
export class RobotComponent implements OnInit {
  playerRobots: any[] = [];
  playerList: { playerId: string, playerName: string }[] = [];
  selectedPlayer = '';
  selectedRobot = '';
  
  constructor(private robotService: RobotService, private scoreboardService: ScoreboardService) { }
  

  getPlayerName(playerId: string): string {
    const player = this.playerList.find(p => p.playerId === playerId);
    return player ? player.playerName : 'Unknown Player';
  }
  ngOnInit() {
    interval(5000).pipe(
      startWith(0), 
      switchMap(() => this.scoreboardService.getScoreboardData()), 
    ).subscribe(data => {
      this.playerList = this.scoreboardService.getPlayerNamesWithIds(data);
      this.robotService.getRobots(this.playerList).subscribe(robots => {
        this.playerRobots = robots;
      });
    });
  }
  getRobotsForPlayer(playerId: string) {
    const playerObject = this.playerRobots.find(player => player.playerId === playerId);    
    return playerObject ? playerObject.robots : []; 
  }
} 