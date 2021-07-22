import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  redirectTo: 'home',
},
{ path: 'home', loadChildren: () => import('./shared/components/home/home.module').then(m => m.HomeModule), },
{ path: 'editor', loadChildren: () => import('./shared/components/editor/editor.module').then(m => m.EditorModule), },
{ path: 'statistics', loadChildren: () => import('./shared/components/statistics/statistics.module').then(m => m.StatisticsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
