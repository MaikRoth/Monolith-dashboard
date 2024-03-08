import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlpanelComponent } from './controlpanel/controlpanel.component';
import { GameComponent } from './game/game.component';
import { RouterModule, Routes } from '@angular/router';
import { ControlpanelRouteComponent } from './controlpanel-route.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: ControlpanelRouteComponent },
];

@NgModule({
  declarations: [ControlpanelRouteComponent, ControlpanelComponent, GameComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ControlpanelModule { }
