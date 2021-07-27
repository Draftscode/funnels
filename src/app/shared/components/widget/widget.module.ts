import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { WidgetComponent } from './widget.component';
import {MatBadgeModule} from '@angular/material/badge';


@NgModule({
  declarations: [
    WidgetComponent,
  ],
  exports: [
    WidgetComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatDatepickerModule,
  ]
})
export class WidgetModule { }
