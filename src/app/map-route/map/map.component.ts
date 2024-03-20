import { Component } from '@angular/core';
import { MapService, Planet } from './map.service';
import { RobotService } from '../robot/robot.service';
import { ScoreboardService } from '../scoreboard/scoreboard.service';
import { timer, switchMap } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  gridMap: any[] = [];
  planetAmount: number = 0;
  blackHoleAmount: number = 0;
  robotAmount: number = 0;
  playerList: { playerId: string, playerName: string }[] = [];
  playerColorMap = new Map<string, string>();
  private colorIndex = 0;
  private colors = ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080', '#800000'];

  constructor(
    private mapService: MapService,
    private robotService: RobotService,
    private scoreboardService: ScoreboardService) { }

  ngOnInit(): void {
    this.loadPlayerColors();
    timer(0, 5000).pipe(
      switchMap(() => this.mapService.getMapData())
    ).subscribe(data => {
      this.processMapData(data[0].mapGrid.planets);
    });
    timer(0, 5000).pipe(
      switchMap(() => this.scoreboardService.getScoreboardData())
    ).subscribe(data => {
      if (this.playerList.length === 0) {
        this.playerList = this.scoreboardService.getPlayerNamesWithIds(data);
        this.playerList.forEach(player => {
          this.assignColorToPlayer(player.playerId);
        });
        this.savePlayerColors();
      } else {
        this.loadPlayerColors();
      }
      this.fetchRobots();
    });
  }
  countPlanets(): number {
    let planetAmount = 0;
    this.gridMap.forEach(row => {
      row.forEach(planet => {
        if (planet) {
          planetAmount++;
        }
      });
    });
    return planetAmount;
  }
  countBlackHoles(): number {
    let blackHoleAmount = 0;
    this.gridMap.forEach(row => {
      row.forEach(planet => {
        if (!planet) {
          blackHoleAmount++;
        }
      });
    });
    return blackHoleAmount;
  }

  assignColorToPlayer(playerId: string): string {
    if (!this.playerColorMap.has(playerId)) {
      const color = this.getRandomColor();
      this.playerColorMap.set(playerId, color);
    }
    return this.playerColorMap.get(playerId);
  }

  savePlayerColors(): void {
    const playerColors = Array.from(this.playerColorMap.entries());
    localStorage.setItem('playerColors', JSON.stringify(playerColors));
  }

  loadPlayerColors(): void {
    const playerColors = JSON.parse(localStorage.getItem('playerColors'));
    if (playerColors) {
      this.playerColorMap = new Map(playerColors);
    }
  }
  getRandomColor(): string {
    const color = this.colors[this.colorIndex];
    this.colorIndex = (this.colorIndex + 1) % this.colors.length;
    return color;
  }
  fetchRobots(): void {
    this.robotService.getRobots(this.playerList).subscribe(robotsData => {
      if (Array.isArray(robotsData)) {
        robotsData.forEach(robot => {
          if (robot.alive && robot.health > 0) {
            let planet = null;
            for (let row of this.gridMap) {
              for (let p of row) {
                if (p && p.id === robot.planet) {
                  planet = p;
                  break;
                }
              }
              if (planet) {
                break;
              }
            }
  
            if (planet) {
              if (!planet.robots) {
                planet.robots = [];
              }
              
              const existingRobot = planet.robots.find(r => r.id === robot.id);
              if (!existingRobot) {
                planet.robots.push(robot);
              } else {
                Object.assign(existingRobot, robot);
              }
            }
          }
        });
      } else {
        console.error('Erwartetes Array von Robotern, erhalten:', robotsData);
      }
    });
  }

  processMapData(planetsMap: { [key: string]: Planet }): void {
    const planets = Object.entries(planetsMap).map(([key, planet]) => {
      const coords = this.extractCoordinates(key);
      return {
        ...planet,
        x: coords.x,
        y: coords.y,
      };
    });
    
    let maxX = Math.max(...planets.map(planet => planet.x));
    let maxY = Math.max(...planets.map(planet => planet.y));

    const gridSizeX = maxX + 1;
    const gridSizeY = maxY + 1;

    this.gridMap = Array.from({ length: gridSizeY }, () =>
    Array.from({ length: gridSizeX }, () => null));
    
    planets.forEach(planet => {
      this.gridMap[planet.y][planet.x] = planet;
    });
    this.planetAmount = this.countPlanets();
    this.blackHoleAmount = this.countBlackHoles();

  }
  extractCoordinates(key: string): { x: number, y: number } {
    const match = key.match(/Coordinates\(x=(\d+), y=(\d+)\)/);

    if (match && match.length >= 3) {
      return {
        x: parseInt(match[1], 10),
        y: parseInt(match[2], 10)
      };
    } else {
      return { x: 0, y: 0 };
    }
  }
  getPlanetGradient(planet): string {
    const totalRobots = planet.robots.length;
    const playerRobotCounts = new Map();

    planet.robots.forEach(robot => {
      const count = playerRobotCounts.get(robot.player) || 0;
      playerRobotCounts.set(robot.player, count + 1);
    });

    const colorStops = [];
    let currentStop = 0;

    playerRobotCounts.forEach((count, playerId) => {
      const color = this.playerColorMap.get(playerId);
      const stop = currentStop + (count / totalRobots) * 100;
      colorStops.push(`${color} ${currentStop}% ${stop}%`);
      currentStop = stop;
    });

    return `linear-gradient(to right, ${colorStops.join(', ')})`;
  }
  formatNumber(amount: number): string {
    if (amount >= 1000) {
      const thousands = Math.floor(amount / 1000);
      const hundred = Math.floor((amount % 1000) / 100);
      return `${thousands}.${hundred}k`;
    }
    return amount.toString();
  }

}
