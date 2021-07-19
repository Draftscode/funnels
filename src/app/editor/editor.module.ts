import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../shared/shared.module';
import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';
import { PageModule } from '../components/page/page.module';
import { MatSidenavModule } from '@angular/material/sidenav';


@NgModule({
  declarations: [
    EditorComponent
  ],
  imports: [
    CommonModule,
    EditorRoutingModule,
    SharedModule,
    NgScrollbarModule,
    PageModule,
    MatSidenavModule,
  ]
})
export class EditorModule { }
