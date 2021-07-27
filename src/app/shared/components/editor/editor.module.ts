import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../shared.module';
import { PageModule } from '../page/page.module';
import { CreateDialogModule } from './create-dialog/create-dialog.module';
import { CtxComponent } from './ctx/ctx.component';
import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';
@NgModule({
  declarations: [
    EditorComponent,
    CtxComponent,
  ],
  imports: [
    DragDropModule,
    CommonModule,
    EditorRoutingModule,
    SharedModule,
    MatDialogModule,
    MatRippleModule,
    FormsModule,
    NgScrollbarModule,
    PageModule,
    MatSidenavModule,
    CreateDialogModule,
  ]
})
export class EditorModule { }
