import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../shared.module';
import { ImageDialogModule } from '../images/dialog/image-dialog.module';
import { PageModule } from '../page/page.module';
import { CreateDialogModule } from './create-dialog/create-dialog.module';
import { CtxComponent } from './ctx/ctx.component';
import { DesignModule } from './design/design.module';
import { EditDialogModule } from './edit-dialog/edit-dialog.module';
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
    MatMenuModule,
    EditorRoutingModule,
    NameEditorModule,
    TranslateModule,
    SharedModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatTooltipModule,
    MatRippleModule,
    FormsModule,
    NgScrollbarModule,
    PageModule,
    MatSidenavModule,
    CreateDialogModule,
    EditDialogModule,
    ImageDialogModule,
    DesignModule,
  ]
})
export class EditorModule { }
