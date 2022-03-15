import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { PageModule } from '../page/page.module';
import { CtxComponent } from './ctx/ctx.component';
import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';
import { NameEditorModule } from './name-editor/name-editor.module';

@NgModule({
  declarations: [
    EditorComponent,
    CtxComponent,
  ],
  imports: [
    DragDropModule,
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSnackBarModule,
    EditorRoutingModule,
    MatButtonModule,
    NameEditorModule,
    TranslateModule,
    MatButtonToggleModule,
    MatTooltipModule,
    NgScrollbarModule,
    PageModule,
    MatSidenavModule,
  ]
})
export class EditorModule { }
