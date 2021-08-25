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
import { SidebarRoutingModule } from './sidebar-routing.module';
import { SidebarComponent } from './sidebar.component';
import { SortByIndexPipe } from './sort-by-index.pipe';

@NgModule({
  declarations: [
    SidebarComponent,
    SortByIndexPipe,
  ],
  exports: [SidebarComponent],
  imports: [
    CommonModule,
    SidebarRoutingModule,
    NgScrollbarModule,
    TranslateModule,
    MatListModule,
    NumberModule,
    NameEditorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  providers: [],
})
export class SidebarModule { }
