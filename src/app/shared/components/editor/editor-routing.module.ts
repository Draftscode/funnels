import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './editor.component';

const routes: Routes = [{
  path: '',
  component: EditorComponent,
}, {
  path: ':funnelId',
  component: EditorComponent,
  children: [{
    path:'design',
    loadChildren: () => import('./design/design.module').then(m => m.DesignModule),
  },{
    path:'pages',
    loadChildren: () => import('./sidebar/sidebar.module').then(m => m.SidebarModule),
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule { }
