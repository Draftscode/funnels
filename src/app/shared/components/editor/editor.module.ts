import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ConfirmDialogModule } from '../../dialog/confirm-dialog/confirm-dialog.module';
import { UrlShortenerModule } from '../../dialog/url-shortener/url-shortener.module';
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
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatListModule,
    MatTabsModule,
    MatSnackBarModule,
    EditorRoutingModule,
    MatButtonModule,
    NameEditorModule,
    TranslateModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatTooltipModule,
    MatRippleModule,
    FormsModule,
    ConfirmDialogModule,
    NgScrollbarModule,
    PageModule,
    MatSidenavModule,
    CreateDialogModule,
    EditDialogModule,
    ImageDialogModule,
    DesignModule,
    UrlShortenerModule,
  ]
})
export class EditorModule { }
