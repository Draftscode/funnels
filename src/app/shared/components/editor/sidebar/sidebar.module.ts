import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NameEditorModule } from '../name-editor/name-editor.module';
import { NumberModule } from '../number/number.module';
import { SidebarComponent } from './sidebar.component';

@NgModule({
  declarations: [
    SidebarComponent
  ],
  exports: [SidebarComponent],
  imports: [
    CommonModule,
    NgScrollbarModule,
    TranslateModule,
    MatListModule,
    NumberModule,
    NameEditorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ]
})
export class SidebarModule { }
