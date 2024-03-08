import { Component } from '@angular/core';
import { ScoreboardData, ScoreboardEntry, ScoreboardService } from './scoreboard.service';
import { timer, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.css'
})
export class ScoreboardComponent {
  scoreboardData?: ScoreboardData;
  sortedEntries: ScoreboardEntry[] = [];
  constructor(private scoreboardService: ScoreboardService) { }

  ngOnInit(): void {
    timer(0, 1000) 
    .pipe(
      startWith(0), 
      switchMap(() => this.scoreboardService.getScoreboardData())
    )
    .subscribe(data => {
      this.scoreboardData = data;
      this.sortedEntries = data.scoreboardEntriesWithAchievements.sort((a, b) => b.totalScore - a.totalScore);
    });
  }
}


