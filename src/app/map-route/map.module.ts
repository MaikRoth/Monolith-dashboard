import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { MapRouteComponent } from './map-route.component';
import { RouterModule, Routes } from '@angular/router';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { RobotComponent } from './robot/robot.component';
const routes: Routes = [
  { path: '', component: MapRouteComponent }
];

@NgModule({
  declarations: [ MapRouteComponent, MapComponent, ScoreboardComponent, RobotComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MapModule { }
