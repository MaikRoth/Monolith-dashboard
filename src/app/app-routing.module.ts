import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./controlpanel-route/controlpanel.module').then(m => m.ControlpanelModule) },
  { path: 'map', loadChildren: () => import('./map-route/map.module').then(m => m.MapModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
